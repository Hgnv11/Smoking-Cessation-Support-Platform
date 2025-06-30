package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

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

    private Integer cigarettesPerDay;

    private Integer cigarettesPerPack;  // Số điếu trong một gói thuốc

    private BigDecimal cigarettePackCost;

    private LocalDate quitDate;

    private LocalDate endDate;


    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
