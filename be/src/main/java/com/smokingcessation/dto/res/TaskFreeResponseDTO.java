package com.smokingcessation.dto.res;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskFreeResponseDTO {
    private Integer taskId;
    private Integer userId;
    private LocalDate taskDay;
    private Integer targetCigarettes;
    private String status;
    private List<SupportMeasureDTO> supportMeasures;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class SupportMeasureDTO {
        private Integer supportMeasuresId;
        private String supportMeasures;
    }
}