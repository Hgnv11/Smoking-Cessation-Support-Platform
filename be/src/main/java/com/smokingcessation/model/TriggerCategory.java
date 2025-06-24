package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trigger_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TriggerCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    private String name;
    private String description;
}
