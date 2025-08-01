package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "plan_tasks_pro")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanTasksPro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private User mentor;

    @Column(name = "task_day", nullable = false)
    private LocalDate taskDay;

    @Column(name = "custom_support_measures", nullable = false, columnDefinition = "TEXT")
    private String customSupportMeasures;

    @Column(name = "target_cigarettes", nullable = false)
    private Integer targetCigarettes;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        pending, completed, failed
    }
}