package com.smokingcessation.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Data
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "badge_id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long badgeId;

    @Column(name = "badge_type", unique = true, nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String badgeType;

    @NotNull
    @Column(name = "badge_name", nullable = false)
    private String badgeName;

    @NotNull
    @Column(name = "badge_description", nullable = false)
    private String badgeDescription;

    @NotNull
    @Column(name = "badge_image_url", nullable = false)
    private String badgeImageUrl;

    @Column(name = "is_active")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private boolean isActive = true;

    @NotNull
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}