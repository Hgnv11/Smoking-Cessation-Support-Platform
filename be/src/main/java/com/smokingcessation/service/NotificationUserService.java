package com.smokingcessation.service;

import com.smokingcessation.dto.res.NotificationUserDTO;
import com.smokingcessation.mapper.NotificationUserMapper;
import com.smokingcessation.model.NotificationUser;
import com.smokingcessation.repository.NotificationUserRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class NotificationUserService {
    private final NotificationUserRepository notificationRepository;
    private final NotificationUserMapper notificationMapper;

    public NotificationUserService(NotificationUserRepository notificationRepository, NotificationUserMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }
    public void notifyUpgradeSuccess(Integer userId) {
        create(userId, "Congratulations! You have successfully your upgraded ");
    }

    public void notifyPostPending(Integer userId) {
        create(userId, "Your post has been submitted. Please wait for the admin to approve.");
    }

    public void notifyPostApproved(Integer userId) {
        create(userId, "Your post has been approved! Please check on the system.");
    }

    public void notifyBookingCoachSuccess(Integer userId, LocalDateTime meetingTime) {
        create(userId, "You have successfully booked the coach. See you at " + meetingTime);
    }

    public void notifyPrepareForMeeting(Integer userId, LocalDateTime meetingTime) {
        create(userId, "You are preparing to meet with the coach at " + meetingTime + " on Google Meet. Please check your devices and schedule!");
    }

    private void create(Integer userId, String content) {
        NotificationUser notification = new NotificationUser();
        notification.setUserId(userId);
        notification.setContent(content);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<NotificationUserDTO> getUserNotifications(Integer userId) {
        return notificationMapper.toDTOs(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }
    public void deleteNotification(Integer id, Integer userId) {
        NotificationUser noti = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        // Check quyền: chỉ cho xóa nếu đúng user
        if (!noti.getUserId().equals(userId)) throw new RuntimeException("Not allowed");
        notificationRepository.delete(noti);
    }
    public void notifyReceiveBadge(Integer userId, String badgeName) {
        String content = "Congratulations! You have just received a badge:" + badgeName;
        create(userId, content);
    }


}
