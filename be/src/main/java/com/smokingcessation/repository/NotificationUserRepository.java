package com.smokingcessation.repository;

import com.smokingcessation.model.NotificationUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationUserRepository extends JpaRepository<NotificationUser, Integer> {
    List<NotificationUser> findByUserIdOrderByCreatedAtDesc(Integer userId);
    void deleteByCreatedAtBefore(LocalDateTime time);
}
