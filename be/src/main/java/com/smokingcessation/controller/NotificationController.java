package com.smokingcessation.controller;

import com.smokingcessation.model.User;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

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

    @Operation(summary = "Mark a notification as read", description = "Marks a specific notification as read for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(
            Principal principal,
            @PathVariable Integer notificationId) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + principal.getName()));
        notificationService.markNotificationAsRead(user, notificationId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Mark all notifications as read", description = "Marks all notifications as read for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All notifications marked as read successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllNotificationsAsRead(
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + principal.getName()));
        notificationService.markAllNotificationsAsRead(user);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Count unread notifications", description = "Returns the number of unread notifications for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved unread notification count"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/unread-count")
    public ResponseEntity<Long> countUnreadNotifications(
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + principal.getName()));
        long count = notificationService.countUnreadNotifications(user);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "Delete a notification", description = "Marks a specific notification as hidden for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            Principal principal,
            @PathVariable Integer notificationId) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + principal.getName()));
        notificationService.deleteNotification(user, notificationId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete all notifications", description = "Marks all notifications as hidden for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All notifications deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @DeleteMapping
    public ResponseEntity<Void> deleteAllNotifications(
             Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + principal.getName()));
        notificationService.deleteAllNotifications(user);
        return ResponseEntity.ok().build();
    }
}
