package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserGrowthDTO {
    private String period;
    private long last_period;
    private long this_period;
}
