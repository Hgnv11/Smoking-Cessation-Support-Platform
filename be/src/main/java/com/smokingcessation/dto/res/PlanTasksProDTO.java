package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanTasksProDTO {

    private Integer taskId;
    private Integer userId;
    private Integer mentorId;
    private LocalDate taskDay;
    private String customSupportMeasures;
    private Integer targetCigarettes;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}