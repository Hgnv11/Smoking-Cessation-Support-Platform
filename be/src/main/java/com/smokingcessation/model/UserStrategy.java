package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_strategies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStrategy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_strategy_id")
    private Integer userStrategyId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "strategy_id", nullable = false)
    private com.smokingcessation.model.Strategy strategy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}