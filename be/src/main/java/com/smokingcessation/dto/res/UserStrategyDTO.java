package com.smokingcessation.dto.res;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStrategyDTO {
    private Integer userId;
    private List<StrategyCategory> strategyCategories;
}