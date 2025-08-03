package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_badges")
@Data
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_badge_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;

    @Column(name = "badge_type", nullable = false)
    private String badgeType;

    @Column(name = "badge_image_url", nullable = false)
    private String badgeImageUrl;

    @Column(name = "earned_date")
    private LocalDateTime earnedDate = LocalDateTime.now();

    @Column(name = "is_active")
    private boolean isActive = true;
}
