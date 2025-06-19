package com.smokingcessation.dto.res;

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
    private UserDTO user;
    private UserDTO mentor;
    private String status;
    private LocalDateTime createdAt;
    private Integer rating;
    private String feedback;
    private String notes;
}
