package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reasons_quit")
@Data
public class ReasonsQuit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reason_id")
    private Integer reasonId;

    @Column(name = "reason_text", nullable = false)
    private String reasonText;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}