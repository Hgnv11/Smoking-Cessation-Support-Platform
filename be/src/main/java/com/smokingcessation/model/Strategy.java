package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "strategies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Strategy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "strategy_id")
    private Integer strategyId;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private com.smokingcessation.model.StrategyCategory category;
}