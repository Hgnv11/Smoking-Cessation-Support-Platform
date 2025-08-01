package com.smokingcessation.controller;

import com.smokingcessation.model.User;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // 1. Mentor gửi thông báo tùy ý
    @PostMapping("/send")
    public ResponseEntity<?> sendCustomNotification(@RequestParam Long mentorId,
                                                    @RequestParam Long userId,
                                                    @RequestParam String title,
                                                    @RequestParam String message) {
        User mentor = userRepository.findById(mentorId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        notificationService.sendCustomNotification(mentor, user, title, message);
        return ResponseEntity.ok("Notification sent.");
    }

    // 2. User lấy thông báo đã nhận (sắp xếp theo thời gian)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(notificationService.getUserNotificationsSorted(user));
    }

    // 3. Mentor xem các thông báo mình đã gửi cho một user
    @GetMapping("/mentor/{mentorId}/sent-to/{userId}")
    public ResponseEntity<?> getMentorSentNotifications(@PathVariable Long mentorId,
                                                        @PathVariable Long userId) {
        User mentor = userRepository.findById(mentorId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(notificationService.getNotificationsSentByMentorToUser(mentor, user));
    }
}
