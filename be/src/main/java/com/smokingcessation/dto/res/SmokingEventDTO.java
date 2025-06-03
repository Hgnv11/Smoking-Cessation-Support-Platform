package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmokingEventDTO {
    private Integer eventId;
    private UserDTO user;
    private LocalDateTime eventTime;
    private Integer cigarettesSmoked;
    private Integer cravingLevel;
    private String mood;
    private String notes;
}