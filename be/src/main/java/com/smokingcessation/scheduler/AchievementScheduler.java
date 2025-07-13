package com.smokingcessation.scheduler;

import com.smokingcessation.model.User;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AchievementScheduler {

    private final UserRepository userRepository;
    private final AchievementService achievementService;

    @Scheduled(cron = "0 0 0 * * ?") // Chạy lúc 0:00 mỗi ngày
    public void checkAllUsersMilestones() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            achievementService.checkAndAwardMilestones(user.getEmail());
        }
    }
}