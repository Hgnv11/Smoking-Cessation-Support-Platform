package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "triggers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trigger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer triggerId;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private TriggerCategory category;
}
