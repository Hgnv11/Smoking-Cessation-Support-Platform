package com.smokingcessation.controller;

import com.smokingcessation.model.NotificationLog;
import com.smokingcessation.repository.NotificationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationLogRepository notificationLogRepository;

    @GetMapping("/logs/{userId}")
    public List<NotificationLog> getLogsByUser(@PathVariable Long userId) {
        return notificationLogRepository.findByUserId(userId);
    }
}
