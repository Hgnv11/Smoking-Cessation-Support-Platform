package com.smokingcessation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smokingcessation.dto.res.UserDTO;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserSmokingProfileRequest {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer profileId;
    private UserDTO user;
    private Integer cigarettesPerDay;
    private Integer cigarettesPerPack;
    private BigDecimal cigarettePackCost;
    private LocalDate quitDate;
    private LocalDate endDate;
    private String status;
}

