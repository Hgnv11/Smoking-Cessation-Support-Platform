package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "progress_milestones")
@Data
public class ProgressMilestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "milestone_id")
    private Long milestoneId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "milestone_type")
    private MilestoneType milestoneType;

    @Column(name = "achieved_date")
    private LocalDateTime achievedDate;

    @Column(name = "reward_points")
    private int rewardPoints;

    public enum MilestoneType {
        TWENTY_FOUR_HOURS, ONE_WEEK, ONE_MONTH, THREE_MONTHS, SIX_MONTHS, ONE_YEAR
    }
}