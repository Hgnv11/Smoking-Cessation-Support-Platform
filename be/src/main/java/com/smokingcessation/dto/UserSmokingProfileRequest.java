package com.smokingcessation.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UserSmokingProfileRequest {


    private String smokingStatus;
    private Integer cigarettesPerDay;
    private Integer yearsSmoking;
    private BigDecimal cigaretteCost;
    private LocalDate quitDate;
    private String motivationLevel;
    private String healthConcerns;
}