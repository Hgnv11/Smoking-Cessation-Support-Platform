package com.smokingcessation.dto.res;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SavingDTO {
    private double dailyCost;
    private double perWeek;
    private double perMonth;
    private double perYear;
    private double actualSaving;
    private Integer cigarettesAvoided;
}
