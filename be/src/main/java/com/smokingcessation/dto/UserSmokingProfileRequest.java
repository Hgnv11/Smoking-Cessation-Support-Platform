package com.smokingcessation.dto;

import com.smokingcessation.dto.res.UserDTO;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserSmokingProfileRequest {
    private UserDTO user;
    private Integer cigarettesPerDay;
    private Integer cigarettesPerPack;
    private BigDecimal cigarettePackCost;
    private LocalDate quitDate;
    private LocalDate endDate;
}

