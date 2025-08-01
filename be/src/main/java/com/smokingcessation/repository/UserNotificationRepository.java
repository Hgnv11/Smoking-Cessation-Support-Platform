package com.smokingcessation.repository;

import com.smokingcessation.model.User;
import com.smokingcessation.model.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Integer> {
    List<UserNotification> findByUserOrderByReceivedAtDesc(User user);

    List<UserNotification> findByUserAndNotification_Sender(User user, User sender);


}