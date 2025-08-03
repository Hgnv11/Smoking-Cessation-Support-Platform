package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "support_measures")
public class SupportMeasure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supportMeasuresId;

    @Column(name = "support_measures", nullable = false)
    private String supportMeasures;
}