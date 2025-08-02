package com.smokingcessation.service;

import com.smokingcessation.dto.res.UserNotificationDTO;
import com.smokingcessation.mapper.UserNotificationMapper;
import com.smokingcessation.model.Notification;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserNotification;
import com.smokingcessation.repository.NotificationRepository;
import com.smokingcessation.repository.UserNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;
    private final UserNotificationMapper userNotificationMapper;

    @Transactional
    public void createWelcomeNotification(User user) {
        // Create welcome notification
        Notification notification = Notification.builder()
                .title("Welcome to Smoking Cessation!")
                .message(String.format("Welcome %s to the Smoking Cessation Program!", user.getFullName()))
                .notificationType(Notification.NotificationType.system)
                .sender(null) // No sender for system notification
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        // Link notification to user
        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void createPaymentSuccessNotification(User user) {
        Notification notification = Notification.builder()
                .title("Payment Successful!")
                .message(String.format("Congratulations, %s! Your payment was successful, and your Premium subscription is now active!", user.getFullName()))
                .notificationType(Notification.NotificationType.system)
                .sender(null)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void createPostApprovalNotification(User user, String postTitle) {
        Notification notification = Notification.builder()
                .title("Post Approved!")
                .message(String.format("Congratulations, %s! Your post '%s' has been approved!", user.getFullName(), postTitle))
                .notificationType(Notification.NotificationType.article_approved)
                .sender(null)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void createNoTaskNotification(User user, LocalDate tomorrow) {
        Notification notification = Notification.builder()
                .title("No Task Scheduled for Tomorrow!")
                .message(String.format("Hi %s, you haven't created a task for %s. Create one now to stay on track!",
                        user.getFullName(), tomorrow.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))))
                .notificationType(Notification.NotificationType.daily_task_reminder)
                .sender(null)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void createFreeTaskReminderNotification(User user, int targetCigarettes) {
        Notification notification = Notification.builder()
                .title("Today's Task Reminder!")
                .message(String.format("Your target for today is %d cigarettes. Keep it up!", targetCigarettes))
                .notificationType(Notification.NotificationType.daily_task_reminder)
                .sender(null)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void createProTaskReminderNotification(User user, User mentor, int targetCigarettes) {
        Notification notification = Notification.builder()
                .title("Today's Task from Your Mentor!")
                .message(String.format("Mentor %s has set a target of %d cigarettes for you today. Let's achieve it!",
                        mentor.getFullName(), targetCigarettes))
                .notificationType(Notification.NotificationType.daily_task_reminder)
                .sender(mentor)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void createTaskAssignmentNotification(User user, User mentor, LocalDate taskDay, int targetCigarettes) {
        Notification notification = Notification.builder()
                .title("New Task Assigned!")
                .message(String.format("Mentor %s has assigned you a task for %s with a target of %d cigarettes.",
                        mentor.getFullName(), taskDay.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), targetCigarettes))
                .notificationType(Notification.NotificationType.task_assigned)
                .sender(mentor)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void createTaskFailedNotification(User user, User mentor, LocalDate taskDay) {
        Notification notification = Notification.builder()
                .title("Task Marked as Failed")
                .message(String.format("Hi %s, your task for %s was marked as failed by Mentor %s. Keep pushing forward!",
                        user.getFullName(), taskDay.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), mentor.getFullName()))
                .notificationType(Notification.NotificationType.plan_failed)
                .sender(mentor)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void sendCustomNotification(User mentor, User receiver, String title, String message) {
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .notificationType(Notification.NotificationType.mentor_message)
                .sender(mentor)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(receiver)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();
        userNotificationRepository.save(userNotification);
    }

    @Transactional
    public void sendDailyConsultationReminder(User user, User mentor, LocalDate slotDate, Integer slotNumber) {
        Notification notification = Notification.builder()
                .title("Today's Consultation Reminder")
                .message(String.format("You have a consultation with Mentor %s today at slot %d on %s.",
                        mentor.getFullName(), slotNumber, slotDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))))
                .notificationType(Notification.NotificationType.system)
                .sender(null)
                .createdAt(LocalDateTime.now())
                .build();

        notification = notificationRepository.save(notification);

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .isHidden(false)
                .receivedAt(LocalDateTime.now())
                .build();

        userNotificationRepository.save(userNotification);
    }


    public List<UserNotificationDTO> getUserNotificationsSorted(User user) {
        return userNotificationRepository.findByUserOrderByReceivedAtDesc(user)
                .stream()
                .map(userNotificationMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<UserNotificationDTO> getNotificationsSentByMentorToUser(User mentor, User user) {
        return userNotificationRepository.findByUserAndNotification_Sender(user, mentor)
                .stream()
                .map(userNotificationMapper::toDto)
                .collect(Collectors.toList());
    }

}