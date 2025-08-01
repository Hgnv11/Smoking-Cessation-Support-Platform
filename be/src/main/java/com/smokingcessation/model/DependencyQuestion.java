package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "dependency_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DependencyQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(nullable = false)
    private Integer questionOrder;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<DependencyAnswer> answers;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}