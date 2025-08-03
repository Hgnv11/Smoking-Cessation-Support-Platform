package com.smokingcessation.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ClientProgressDTO {
    private String clientName;
    private int smokeFreeDays;
    private int sessionsAttended;
    private double successRate;
    private String status;
}
