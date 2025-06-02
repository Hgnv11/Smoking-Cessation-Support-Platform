package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_smoking_profiles")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSmokingProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer profileId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private SmokingStatus smokingStatus;

    private Integer cigarettesPerDay;
    private Integer yearsSmoking;
    private BigDecimal cigaretteCost;
    private LocalDate quitDate;

    @Enumerated(EnumType.STRING)
    private MotivationLevel motivationLevel;

    private String healthConcerns;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt = LocalDateTime.now();
    public enum SmokingStatus {
        active, quitting, quit
    }

    public enum MotivationLevel {
        low, medium, high
    }
}
