package com.smokingcessation.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserSmokingProfileRequest {
    private Integer userId;
    private Integer cigarettesPerDay;
    private Integer cigarettesPerPack;   // thêm trường này
    private BigDecimal cigarettePackCost;
    private LocalDate quitDate;
}

