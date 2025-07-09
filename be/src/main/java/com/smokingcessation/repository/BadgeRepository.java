package com.smokingcessation.repository;

import com.smokingcessation.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByBadgeType(String badgeType);
}