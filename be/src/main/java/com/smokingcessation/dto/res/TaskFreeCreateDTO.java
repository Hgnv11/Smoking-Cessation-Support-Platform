// TaskFreeCreateDTO.java
package com.smokingcessation.dto.res;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TaskFreeCreateDTO {
    private LocalDate taskDay;
    private Integer targetCigarettes;
    private String status;
    private List<Integer> supportMeasureIds;
}