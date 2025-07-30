package com.smokingcessation.service;

import com.smokingcessation.model.NotificationLog;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.NotificationLogRepository;
import com.smokingcessation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationLogRepository notificationLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void sendDailyNotifications() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                emailService.sendReminderEmail(user.getEmail(), user.getFullName());
                // Ghi log lại
                NotificationLog log = new NotificationLog(
                        null,
                        user.getUserId(),
                        user.getEmail(),
                        "Đã gửi nhắc nhở hằng ngày qua email",
                        LocalDateTime.now()
                );
                notificationLogRepository.save(log);
            }
        }
    }

}
