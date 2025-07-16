package com.smokingcessation.scheduler;

import com.smokingcessation.repository.NotificationUserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationCleanupScheduler {
    private final NotificationUserRepository notificationRepository;

    public NotificationCleanupScheduler(NotificationUserRepository repo) {
        this.notificationRepository = repo;
    }

    // Chạy mỗi ngày lúc 2h sáng, xóa notification đã tạo quá 3 ngày
    @Scheduled(cron = "0 0 2 * * *")
    public void deleteOldNotifications() {
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
        notificationRepository.deleteByCreatedAtBefore(threeDaysAgo);
    }
}
