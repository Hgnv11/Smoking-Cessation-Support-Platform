package com.smokingcessation.service;

import com.smokingcessation.dto.UserSmokingProfileRequest;
import com.smokingcessation.dto.res.SavingDTO;
import com.smokingcessation.dto.res.SmokingEventDTO;
import com.smokingcessation.mapper.UserSmokingProfileMapper;
import com.smokingcessation.model.SmokingEvent;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserSmokingProfile;
import com.smokingcessation.repository.SmokingEventRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.UserSmokingProfileRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class UserSmokingProfileService {

    private final UserRepository userRepository;
    private final UserSmokingProfileRepository userSmokingProfileRepository;
    private final UserSmokingProfileMapper mapper;
    private final SmokingEventRepository smokingEventRepository;

    public UserSmokingProfileService(UserRepository userRepository, UserSmokingProfileRepository userSmokingProfileRepository, UserSmokingProfileMapper mapper, SmokingEventRepository smokingEventRepository) {
        this.userRepository = userRepository;
        this.userSmokingProfileRepository = userSmokingProfileRepository;
        this.mapper = mapper;
        this.smokingEventRepository = smokingEventRepository;
    }

    public List<UserSmokingProfileRequest> getAllProfilesByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<UserSmokingProfile> profiles = userSmokingProfileRepository.findAllByUser(user);
        return profiles.stream().map(mapper::toDto).toList();
    }

    public UserSmokingProfileRequest AddProfileByEmail(String email, UserSmokingProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // CHỈ cho tạo mới nếu KHÔNG có profile chưa completed
        if (userSmokingProfileRepository.findByUserAndStatusNot(user, "completed").isPresent()) {
            throw new RuntimeException("Bạn đã có kế hoạch bỏ thuốc đang hoạt động. Hãy hoàn thành hoặc hủy trước khi tạo mới.");
        }

        UserSmokingProfile profile = new UserSmokingProfile();
        profile.setUser(user);
        profile.setCigarettesPerDay(request.getCigarettesPerDay());
        profile.setCigarettesPerPack(request.getCigarettesPerPack());
        profile.setCigarettePackCost(request.getCigarettePackCost());
        profile.setQuitDate(request.getQuitDate());
        profile.setEndDate(request.getEndDate());
        profile.setStatus("active");
        profile.setUpdatedAt(LocalDateTime.now());

        UserSmokingProfile savedProfile = userSmokingProfileRepository.save(profile);
        return mapper.toDto(savedProfile);
    }

    public UserSmokingProfileRequest UpdateProfileByEmail(String email, UserSmokingProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("No active quit plan found"));

        if ("completed".equalsIgnoreCase(profile.getStatus())) {
            throw new RuntimeException("Kế hoạch đã hoàn thành, không thể cập nhật.");
        }

        profile.setCigarettesPerDay(request.getCigarettesPerDay());
        profile.setCigarettesPerPack(request.getCigarettesPerPack());
        profile.setCigarettePackCost(request.getCigarettePackCost());
        profile.setStatus(request.getStatus());
        profile.setUpdatedAt(LocalDateTime.now());
        if(request.getStatus().equals("completed")) {
            profile.setEndDate(request.getEndDate() != null ? request.getEndDate() : LocalDate.now());
        }else {
            profile.setEndDate(request.getEndDate());
        }
        UserSmokingProfile savedProfile = userSmokingProfileRepository.save(profile);
        return mapper.toDto(savedProfile);
    }

    public UserSmokingProfileRequest getProfileByProfileName(String profileName) {
        User user = userRepository.findByProfileName(profileName)
                .orElseThrow(() -> new RuntimeException("User not found with profile name: " + profileName));
        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("No active quit plan found"));

        return mapper.toDto(profile);
    }

    // lấy chuỗi ngày cai thuốc

    public long getDaysSinceLastSmoke(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        // Lấy profile để kiểm tra ngày quit ban đầu
        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("No active quit plan found"));

        // Tìm sự kiện hút thuốc gần nhất (nếu có)
        Optional<SmokingEvent> latestEventOpt = smokingEventRepository.findTopByUserOrderByEventTimeDesc(user);
        LocalDate lastSmokeDate;

        if (latestEventOpt.isPresent()) {
            // Nếu đã hút thuốc sau ngày quit, dùng ngày đó
            SmokingEvent lastEvent = latestEventOpt.get();
            if (lastEvent.getEventTime().toLocalDate().isAfter(profile.getQuitDate())) {
                lastSmokeDate = lastEvent.getEventTime().toLocalDate();
            } else {
                // Nếu không, vẫn tính từ ngày quit
                lastSmokeDate = profile.getQuitDate();
            }
        } else {
            // Nếu không có event nào, dùng quitDate
            lastSmokeDate = profile.getQuitDate();
        }
        long days = ChronoUnit.DAYS.between(lastSmokeDate, LocalDate.now());
        return days;
    }

    // lấy tổng số ngày thực hiện kế hoạch
    public long getDaysOnQuitPlan(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("No active quit plan found"));
        LocalDate quitDate = profile.getQuitDate();
        if (quitDate == null) {
            throw new RuntimeException("Quit date is not set for user");
        }

        long days = ChronoUnit.DAYS.between(quitDate, LocalDate.now());
        return Math.max(days, 0);
    }

    public SavingDTO calculateSavings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));

        // Lấy hồ sơ với status = "active"
        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch bỏ thuốc đang hoạt động"));

        // Tính chi phí mỗi ngày
        int cigarettesPerDay = profile.getCigarettesPerDay() != null ? profile.getCigarettesPerDay() : 0;
        int cigarettesPerPack = profile.getCigarettesPerPack() != null ? profile.getCigarettesPerPack() : 20;
        BigDecimal packCost = profile.getCigarettePackCost() != null ? profile.getCigarettePackCost() : BigDecimal.ZERO;

        BigDecimal costPerCigarette = BigDecimal.ZERO;
        BigDecimal dailyCost = BigDecimal.ZERO;
        if (cigarettesPerDay > 0 && cigarettesPerPack > 0 && packCost.compareTo(BigDecimal.ZERO) > 0) {
            costPerCigarette = packCost.divide(BigDecimal.valueOf(cigarettesPerPack), 2, RoundingMode.HALF_UP);
            dailyCost = costPerCigarette.multiply(BigDecimal.valueOf(cigarettesPerDay));
        }

        // Số ngày kể từ ngày bỏ thuốc (tính cả ngày bắt đầu)
        LocalDate today = LocalDate.now();
        LocalDate quitDate = profile.getQuitDate();
        long daysSinceQuit = quitDate != null ? ChronoUnit.DAYS.between(quitDate, today) + 1 : 0;
        if (daysSinceQuit < 1) daysSinceQuit = 0;

        // Tổng số điếu thuốc đã hút kể từ khi bỏ thuốc
        LocalDateTime quitDateTime = quitDate != null ? quitDate.atStartOfDay() : LocalDateTime.now();
        int cigarettesSmokedSinceQuit = smokingEventRepository
                .sumCigarettesSmokedSince(user.getUserId(), quitDateTime);

        // Số điếu thuốc lẽ ra sẽ hút
        int expectedCigarettes = cigarettesPerDay * (int) daysSinceQuit;

        // Số điếu thuốc đã tránh được
        int cigarettesAvoided = Math.max(expectedCigarettes - cigarettesSmokedSinceQuit, 0);

        // Tổng chi phí lý thuyết nếu vẫn hút
        BigDecimal totalExpectedCost = dailyCost.multiply(BigDecimal.valueOf(daysSinceQuit));

        // Số tiền đã tiêu vì hút lại
        BigDecimal actualSpent = costPerCigarette.multiply(BigDecimal.valueOf(cigarettesSmokedSinceQuit));

        // Số tiền tiết kiệm thực tế
        BigDecimal actualSaving = totalExpectedCost.subtract(actualSpent).max(BigDecimal.ZERO);

        // Tính tiết kiệm theo tuần/tháng/năm
        BigDecimal perWeek = dailyCost.multiply(BigDecimal.valueOf(7));
        BigDecimal perMonth = dailyCost.multiply(BigDecimal.valueOf(30));
        BigDecimal perYear = dailyCost.multiply(BigDecimal.valueOf(365));

        return new SavingDTO(
                dailyCost.doubleValue(),
                perWeek.doubleValue(),
                perMonth.doubleValue(),
                perYear.doubleValue(),
                actualSaving.doubleValue(),
                cigarettesAvoided
        );
    }

    @Transactional
    public void deleteProfileByEmailAndProfileId(String email, Integer profileId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        UserSmokingProfile profile = userSmokingProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + profileId));

        if (!profile.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You do not have permission to delete this profile");
        }

        // Xác định khoảng thời gian để xóa event
        LocalDate quitDate = profile.getQuitDate();
        LocalDate endDate = profile.getEndDate() != null ? profile.getEndDate() : LocalDate.now();

        LocalDateTime from = quitDate.atStartOfDay();
        LocalDateTime to = endDate.atTime(23, 59, 59);

        // Xóa các sự kiện trong khoảng từ ngày bỏ thuốc đến kết thúc
        smokingEventRepository.deleteAllByUserAndEventTimeBetween(user, from, to);

        // Xóa profile
        userSmokingProfileRepository.delete(profile);
    }

    public String evaluatePlanResult(String email, Integer profileId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSmokingProfile profile = userSmokingProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (!profile.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You do not have permission to view this profile");
        }

        if (!"completed".equalsIgnoreCase(profile.getStatus())) {
            return "incomplete";
        }

        LocalDate quitDate = profile.getQuitDate();
        LocalDate endDate = profile.getEndDate();

        if (quitDate == null || endDate == null || quitDate.isAfter(endDate)) {
            return "incomplete";
        }

        LocalDateTime from = quitDate.atStartOfDay();
        LocalDateTime to = endDate.atTime(23, 59, 59);

        long days = ChronoUnit.DAYS.between(quitDate, endDate) + 1;
        if (days < 1) days = 1;

        int expected = profile.getCigarettesPerDay() * (int) days;
        int smoked = smokingEventRepository.sumCigarettesSmokedBetween(user.getUserId(), from, to);
        int avoided = Math.max(expected - smoked, 0);

        double successRate = expected > 0 ? (avoided * 1.0 / expected) : 0;

        return successRate >= 0.7 ? "success" : "failed";
    }
}
