package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class PlanResultStatsDTO {
    private int total;
    private int success;
    private int failed;
    private String successRate;
    private List<DistributionItem> distribution;

    @Data
    @AllArgsConstructor
    public static class DistributionItem {
        private String name;
        private int value;
    }
}
