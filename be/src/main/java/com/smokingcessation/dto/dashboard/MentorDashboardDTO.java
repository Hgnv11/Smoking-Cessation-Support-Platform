package com.smokingcessation.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MentorDashboardDTO {
    private int todayBookedSlots;
    private int totalAppointmentDays;
    private int totalBookedSlots;
    private int availableSlots;
    private int uniqueClients;
}
