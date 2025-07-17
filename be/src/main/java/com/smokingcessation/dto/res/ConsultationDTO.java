package com.smokingcessation.dto.res;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConsultationDTO {

    private int consultationId;

    @NotNull(message = "Slot must not be null")
    private ConsultationSlotDTO slot;

    @NotNull(message = "User must not be null")
    private UserDTO user;

    @NotBlank(message = "Status must not be blank")
    private String status;

    private LocalDateTime createdAt;

    @Min(value = 0, message = "Rating must be at least 0")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    private String feedback;

    private String meetingLink;

    private String notes;
}
