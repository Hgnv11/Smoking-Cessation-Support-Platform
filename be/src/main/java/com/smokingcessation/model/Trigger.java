package com.smokingcessation.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @Column(name = "trigger_id")
    private Integer triggerId;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonBackReference
    private TriggerCategory category;
}