package com.smokingcessation.dto.res;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProgressMilestoneDTO {
    private Long milestoneId;
    private Long userId;
    private String milestoneType;
    private LocalDateTime achievedDate;
    private int rewardPoints;
}