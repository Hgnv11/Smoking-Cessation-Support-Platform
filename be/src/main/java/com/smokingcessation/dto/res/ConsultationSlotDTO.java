package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConsultationSlotDTO {
    private int slotId;
    private UserDTO mentor;
    private int slotNumber;
    private LocalDate slotDate;
    private boolean isBooked;
    private LocalDateTime createdAt;
}
