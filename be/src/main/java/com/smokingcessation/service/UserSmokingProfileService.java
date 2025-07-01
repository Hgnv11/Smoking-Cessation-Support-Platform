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
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        // Lấy profile
        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("No active quit plan found"));

        // Tính số tiền tiết kiệm mỗi ngày
        BigDecimal dailyCost = BigDecimal.ZERO;
        if (profile.getCigarettesPerDay() > 0 && profile.getCigarettesPerPack() > 0) {
            BigDecimal costPerCigarette = profile.getCigarettePackCost()
                    .divide(BigDecimal.valueOf(profile.getCigarettesPerPack()), 2, RoundingMode.HALF_UP);
            dailyCost = costPerCigarette.multiply(BigDecimal.valueOf(profile.getCigarettesPerDay()));
        }

        // Số ngày kể từ ngày bỏ thuốc
        LocalDate today = LocalDate.now();
        long daysSinceQuit = ChronoUnit.DAYS.between(profile.getQuitDate(), today);
        if (daysSinceQuit < 0) daysSinceQuit = 0;

        // Tổng số điếu thuốc đã hút từ ngày bỏ thuốc
        LocalDateTime quitDateTime = profile.getQuitDate().atStartOfDay();
        int cigarettesSmokedSinceQuit = smokingEventRepository.sumCigarettesSmokedSince(user.getUserId(), quitDateTime);

        // Số tiền lẽ ra phải chi nếu vẫn hút như cũ
        BigDecimal totalExpectedCost = dailyCost.multiply(BigDecimal.valueOf(daysSinceQuit));

        // Số tiền thực sự đã chi vì hút lại một số điếu
        BigDecimal actualSpent = BigDecimal.ZERO;
        if (profile.getCigarettesPerPack() > 0) {
            BigDecimal costPerCigarette = profile.getCigarettePackCost()
                    .divide(BigDecimal.valueOf(profile.getCigarettesPerPack()), 2, RoundingMode.HALF_UP);
            actualSpent = costPerCigarette.multiply(BigDecimal.valueOf(cigarettesSmokedSinceQuit));
        }

        // Số tiền tiết kiệm thực tế
        BigDecimal actualSaving = totalExpectedCost.subtract(actualSpent);

        // Tiết kiệm lý thuyết theo tuần, tháng, năm
        BigDecimal weekly = dailyCost.multiply(BigDecimal.valueOf(7));
        BigDecimal monthly = dailyCost.multiply(BigDecimal.valueOf(30));
        BigDecimal yearly = dailyCost.multiply(BigDecimal.valueOf(365));

        return new SavingDTO(
                dailyCost.doubleValue(),
                weekly.doubleValue(),
                monthly.doubleValue(),
                yearly.doubleValue(),
                actualSaving.doubleValue()
        );
    }


}
