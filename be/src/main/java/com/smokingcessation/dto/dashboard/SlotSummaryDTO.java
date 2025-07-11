package com.smokingcessation.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class SlotSummaryDTO {
    private int consultationId;
    private int slotId;
    private int slotNumber;
    private LocalDate slotDate;
    private String clientName; // nếu là mentor xem user
    private String mentorName; // nếu là user xem mentor
    private String status;
}
