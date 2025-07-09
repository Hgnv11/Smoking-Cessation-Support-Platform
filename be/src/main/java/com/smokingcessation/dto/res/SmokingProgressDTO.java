package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SmokingProgressDTO {
    private Integer profileId;

    private LocalDate startDate;
    private LocalDate endDate;
    private long daysSinceStart;
    private Integer targetDays;
    private String status;
    private String planResult;

    private Integer cigarettesPerDay;
    private Integer cigarettesPerPack;
    private BigDecimal cigarettePackCost;

    private BigDecimal moneySaved;
    private Integer cigarettesAvoided;

    private Map<LocalDate, List<SmokingEventDTO>> smokingHistoryByDate;
}
