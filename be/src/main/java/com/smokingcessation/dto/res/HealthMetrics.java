package com.smokingcessation.dto.res;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetrics {
    private double bpSystolic;
    private double bpDiastolic;
    private double heartRate;
    private double spo2;
    private double cohb;

}