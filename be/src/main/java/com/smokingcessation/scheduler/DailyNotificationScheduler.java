package com.smokingcessation.scheduler;

import com.smokingcessation.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DailyNotificationScheduler {
    @Autowired
    private NotificationService notificationService;

    // 8h sáng mỗi ngày
    @Scheduled(cron = "0 0 8 * * ?")
    public void scheduleDailyNotification() {
        notificationService.sendDailyNotifications();
    }

}
