package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "task_support_measures")
public class TaskSupportMeasure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer taskSupportMeasureId;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private PlanTasksFree planTaskFree;

    @ManyToOne
    @JoinColumn(name = "support_measures_id", nullable = false)
    private SupportMeasure supportMeasure;
}
