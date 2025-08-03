package com.smokingcessation.controller;

import com.smokingcessation.dto.res.NotificationUserDTO;
import com.smokingcessation.service.NotificationUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationUserController {

    private final NotificationUserService notificationService;

    public NotificationUserController(NotificationUserService service) {
        this.notificationService = service;
    }

    @GetMapping("/user/{userId}")
    public List<NotificationUserDTO> getUserNotifications(@PathVariable Integer userId) {
        return notificationService.getUserNotifications(userId);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, @RequestParam Integer userId) {
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build();
    }

}
