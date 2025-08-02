// UserDependencyScore.java
package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_dependency_scores")
@Builder
public class UserDependencyScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scoreId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer totalScore;

    @Enumerated(EnumType.STRING)
    private DependencyLevel dependencyLevel;

    private LocalDateTime assessmentDate = LocalDateTime.now();

    public enum DependencyLevel {
        very_low, low, medium, high, very_high
    }
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
