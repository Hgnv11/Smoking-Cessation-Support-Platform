package com.smokingcessation.dto.res;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Mentor information is required")
    private UserDTO mentor;

    @Min(value = 1, message = "Slot number must be between 1 and 4")
    @Max(value = 4, message = "Slot number must be between 1 and 4")
    private int slotNumber;

    @NotNull(message = "Slot date is required")
    @FutureOrPresent(message = "Slot date cannot be in the past")
    private LocalDate slotDate;

    private boolean booked;

    private LocalDateTime createdAt;
}
