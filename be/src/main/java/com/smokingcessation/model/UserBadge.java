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
    @Column(name = "badge_id")
    private Long badgeId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String badgeType;

    private String badgeImageUrl;

    private LocalDateTime earnedDate;

    private boolean isActive = true;
}