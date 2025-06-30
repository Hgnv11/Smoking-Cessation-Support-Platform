package com.smokingcessation.dto.res;

import com.smokingcessation.model.StrategyCategory;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStrategyDTO {
    private Integer userId;
    private List<StrategyCategory> strategyCategories;
}