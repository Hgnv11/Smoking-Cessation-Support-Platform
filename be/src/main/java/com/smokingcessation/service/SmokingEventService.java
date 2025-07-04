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
        return smokingEventMapper.toDto(updatedEvent);
    }

    public void deleteSmokingEvent(int eventId, String userEmail) {
        SmokingEvent smokingEvent = smokingEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Smoking event not found"));
        if (!smokingEvent.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You do not have permission to delete this smoking event");
        }
        smokingEventRepository.delete(smokingEvent);
    }

    public List<SmokingProgressDTO> getAllSmokingProgressByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserSmokingProfile> profiles = userSmokingProfileRepository.findByUser(user);
        List<SmokingEvent> allEvents = smokingEventRepository.findByUser(user);

        return profiles.stream().map(profile -> {
            LocalDate startDate = profile.getQuitDate();
            LocalDate endDate = profile.getEndDate();

            long daysSinceStart = startDate != null ? ChronoUnit.DAYS.between(startDate, LocalDate.now()) : 0;
            Integer targetDays = (startDate != null && endDate != null)
                    ? (int) ChronoUnit.DAYS.between(startDate, endDate)
                    : null;

            // Lọc sự kiện thuộc profile này (theo ngày nằm trong khoảng kế hoạch)
            List<SmokingEvent> profileEvents = allEvents.stream()
                    .filter(e -> {
                        LocalDate date = e.getEventTime().toLocalDate();
                        return (startDate == null || !date.isBefore(startDate)) &&
                                (endDate == null || !date.isAfter(endDate));
                    })
                    .toList();

            // Gom nhóm theo ngày
            Map<LocalDate, List<SmokingEventDTO>> grouped = profileEvents.stream()
                    .map(smokingEventMapper::toDto)
                    .collect(Collectors.groupingBy(dto -> dto.getEventTime().toLocalDate()));

            // Tính toán tiết kiệm và điếu thuốc đã tránh
            int cigarettesPerDay = profile.getCigarettesPerDay() != null ? profile.getCigarettesPerDay() : 0;
            int cigarettesPerPack = profile.getCigarettesPerPack() != null ? profile.getCigarettesPerPack() : 20;
            BigDecimal packCost = profile.getCigarettePackCost() != null ? profile.getCigarettePackCost() : BigDecimal.ZERO;

            BigDecimal pricePerCigarette = packCost
                    .divide(BigDecimal.valueOf(cigarettesPerPack), 2, RoundingMode.HALF_UP);

            int totalSmoked = profileEvents.stream()
                    .mapToInt(SmokingEvent::getCigarettesSmoked)
                    .sum();

            int expected = cigarettesPerDay * (int) daysSinceStart;
            int avoided = Math.max(expected - totalSmoked, 0);

            BigDecimal expectedCost = pricePerCigarette.multiply(BigDecimal.valueOf(expected));
            BigDecimal spentCost = pricePerCigarette.multiply(BigDecimal.valueOf(totalSmoked));
            BigDecimal moneySaved = expectedCost.subtract(spentCost).max(BigDecimal.ZERO);

            return SmokingProgressDTO.builder()
                    .profileId(profile.getProfileId())
                    .startDate(startDate)
                    .endDate(endDate)
                    .daysSinceStart(daysSinceStart)
                    .targetDays(targetDays)
                    .status(profile.getStatus())
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
