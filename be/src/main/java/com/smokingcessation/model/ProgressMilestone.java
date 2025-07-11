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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "milestone_type", nullable = false)
    private MilestoneType milestoneType;

    @Column(name = "achieved_date")
    private LocalDateTime achievedDate;

    @Column(name = "reward_points")
    private int rewardPoints;

    public enum MilestoneType {
        TWENTY_FOUR_HOURS("24_hours"),
        ONE_WEEK("1_week"),
        ONE_MONTH("1_month"),
        THREE_MONTHS("3_months"),
        SIX_MONTHS("6_months"),
        ONE_YEAR("1_year");

        private final String value;

        MilestoneType(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return value;
        }
    }
}