package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dependency_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencyAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer answerId;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private DependencyQuestion question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answerText;

    @Column(nullable = false)
    private Integer points;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
