package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_dependency_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDependencyResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer responseId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private DependencyQuestion question;

    @ManyToOne
    @JoinColumn(name = "answer_id", nullable = false)
    private DependencyAnswer answer;

    private LocalDateTime responseDate = LocalDateTime.now();
}