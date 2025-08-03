package com.smokingcessation.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MentorReportDTO {
    private int totalSessionsThisMonth;
    private double successRate;
    private double clientRetentionRate;
    private double sessionCompletionRate;
}
