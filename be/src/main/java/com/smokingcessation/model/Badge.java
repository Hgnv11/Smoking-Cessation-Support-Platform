package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Data
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "badge_id")
    private Long badgeId;

    @Column(name = "badge_type", unique = true, nullable = false)
    private String badgeType;

    @Column(name = "badge_name", nullable = false)
    private String badgeName;

    @Column(name = "badge_description", nullable = false)
    private String badgeDescription;

    @Column(name = "badge_image_url", nullable = false)
    private String badgeImageUrl;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}