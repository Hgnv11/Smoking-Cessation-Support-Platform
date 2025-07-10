package com.smokingcessation.service;

import com.smokingcessation.dto.res.SavingDTO;
import com.smokingcessation.dto.res.SmokingEventDTO;
import com.smokingcessation.dto.res.SmokingProgressDTO;
import com.smokingcessation.mapper.SmokingEventMapper;
import com.smokingcessation.model.SmokingEvent;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserSmokingProfile;
import com.smokingcessation.repository.SmokingEventRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.UserSmokingProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SmokingEventService {

    private final UserRepository userRepository;
    private final SmokingEventRepository smokingEventRepository;
    private final SmokingEventMapper smokingEventMapper;
    private final UserSmokingProfileRepository userSmokingProfileRepository;
    private final AchievementService achievementService;
    private final UserSmokingProfileService userSmokingProfileService;


    public SmokingEventDTO addNewSmokingEvent(String userEmail, SmokingEventDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getCigarettesSmoked() == null) {
            throw new RuntimeException("Cigarettes smoked cannot be null");
        }
        if (request.getCravingLevel() != null &&
                (request.getCravingLevel() < 0 || request.getCravingLevel() > 10)) {
            throw new RuntimeException("Craving level must be between 0 and 10");
        }

        SmokingEvent smokingEvent = smokingEventMapper.toEntity(request);
        smokingEvent.setUser(user);
        smokingEvent.setEventTime(LocalDateTime.now());

        SmokingEvent savedEvent = smokingEventRepository.save(smokingEvent);
        achievementService.checkAndAwardMilestones(userEmail);
        return smokingEventMapper.toDto(savedEvent);
    }

    public List<SmokingEventDTO> getMySmokingEvents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<SmokingEvent> events = smokingEventRepository.findByUser(user);
        return events.stream()
                .map(smokingEventMapper::toDto)
                .toList();
    }

    public SmokingEventDTO updateSmokingEvent(int eventId, String userEmail, SmokingEventDTO request) {
        SmokingEvent smokingEvent = smokingEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Smoking event not found"));

        if (!smokingEvent.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You do not have permission to update this smoking event");
        }
        if (request.getCigarettesSmoked() == null) {
            throw new RuntimeException("Cigarettes smoked cannot be null");
        }
        if (request.getCravingLevel() != null &&
                (request.getCravingLevel() < 0 || request.getCravingLevel() > 10)) {
            throw new RuntimeException("Craving level must be between 0 and 10");
        }
        smokingEvent.setCigarettesSmoked(request.getCigarettesSmoked());
        smokingEvent.setCravingLevel(request.getCravingLevel());
        smokingEvent.setNotes(request.getNotes());
        smokingEvent.setEventTime(request.getEventTime() != null ? request.getEventTime() : LocalDateTime.now());

        SmokingEvent updatedEvent = smokingEventRepository.save(smokingEvent);
        achievementService.checkAndAwardMilestones(userEmail);
        return smokingEventMapper.toDto(updatedEvent);
    }

    public void deleteSmokingEvent(int eventId, String userEmail) {
        SmokingEvent smokingEvent = smokingEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Smoking event not found"));
        if (!smokingEvent.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You do not have permission to delete this smoking event");
        }
        smokingEventRepository.delete(smokingEvent);
        achievementService.checkAndAwardMilestones(userEmail);
    }

    public List<SmokingProgressDTO> getAllSmokingProgressByUser(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserSmokingProfile> profiles = userSmokingProfileRepository.findByUser(user);

        return profiles.stream().map(profile -> {
            LocalDate startDate = profile.getQuitDate();
            LocalDate endDate = profile.getEndDate();
            LocalDate today = LocalDate.now();

            // Ngày kết thúc hợp lệ (hôm nay nếu chưa kết thúc)
            LocalDate effectiveEnd = (endDate != null && endDate.isBefore(today)) ? endDate : today;

            // Tính số ngày thực hiện, nhưng không tính nếu hôm nay là ngày bắt đầu
            long daysSinceStart = 0;
            if (startDate != null && !effectiveEnd.isBefore(startDate) && startDate.isBefore(today)) {
                daysSinceStart = ChronoUnit.DAYS.between(startDate, effectiveEnd) + 1;
            }

            Integer targetDays = (startDate != null && endDate != null)
                    ? (int) ChronoUnit.DAYS.between(startDate, endDate)
                    : null;

            // Lấy khoảng thời gian sự kiện
            LocalDateTime from = (startDate != null) ? startDate.atStartOfDay() : LocalDateTime.MIN;
            LocalDateTime to = (endDate != null) ? endDate.atTime(23, 59, 59) : LocalDateTime.now();
            List<SmokingEvent> profileEvents = smokingEventRepository.findByUserAndEventTimeBetween(user, from, to);

            // Gom nhóm theo ngày
            Map<LocalDate, List<SmokingEventDTO>> grouped = profileEvents.stream()
                    .map(smokingEventMapper::toDto)
                    .collect(Collectors.groupingBy(dto -> dto.getEventTime().toLocalDate()));

            int cigarettesPerDay = Optional.ofNullable(profile.getCigarettesPerDay()).orElse(0);
            int cigarettesPerPack = Optional.ofNullable(profile.getCigarettesPerPack()).orElse(20);
            BigDecimal packCost = Optional.ofNullable(profile.getCigarettePackCost()).orElse(BigDecimal.ZERO);

            BigDecimal pricePerCigarette = BigDecimal.ZERO;
            if (cigarettesPerPack > 0) {
                pricePerCigarette = packCost.divide(BigDecimal.valueOf(cigarettesPerPack), 2, RoundingMode.HALF_UP);
            }

            int totalSmoked = profileEvents.stream()
                    .mapToInt(SmokingEvent::getCigarettesSmoked)
                    .sum();

            int expected = cigarettesPerDay * (int) daysSinceStart;
            int avoided = Math.max(expected - totalSmoked, 0);

            BigDecimal expectedCost = pricePerCigarette.multiply(BigDecimal.valueOf(expected));
            BigDecimal spentCost = pricePerCigarette.multiply(BigDecimal.valueOf(totalSmoked));
            BigDecimal moneySaved = expectedCost.subtract(spentCost).max(BigDecimal.ZERO);

            String planResult = userSmokingProfileService.evaluatePlanResult(user.getEmail(), profile.getProfileId());

            return SmokingProgressDTO.builder()
                    .profileId(profile.getProfileId())
                    .startDate(startDate)
                    .endDate(endDate)
                    .daysSinceStart(daysSinceStart)
                    .targetDays(targetDays)
                    .status(profile.getStatus())
                    .planResult(planResult)
                    .cigarettesPerDay(cigarettesPerDay)
                    .cigarettesPerPack(cigarettesPerPack)
                    .cigarettePackCost(packCost)
                    .moneySaved(moneySaved.setScale(0, RoundingMode.HALF_UP))
                    .cigarettesAvoided(avoided)
                    .smokingHistoryByDate(grouped)
                    .build();
        }).toList();
    }

}
