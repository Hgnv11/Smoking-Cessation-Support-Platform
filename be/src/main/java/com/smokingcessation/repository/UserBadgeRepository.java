package com.smokingcessation.repository;

import com.smokingcessation.model.User;
import com.smokingcessation.model.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUser(User user);
    Optional<UserBadge> findByUserAndBadgeType(User user, String badgeType);
}