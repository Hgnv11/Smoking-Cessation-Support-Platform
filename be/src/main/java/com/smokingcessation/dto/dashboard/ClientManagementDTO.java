package com.smokingcessation.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ClientManagementDTO {
    private int totalClients;
    private int premiumClients;
    private int highCravingClients;
    private BigDecimal totalMoneySaved;
}
