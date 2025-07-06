package com.smokingcessation.dto.res;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmokingEventDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer eventId;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UserDTO user;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime eventTime;
    private Integer cigarettesSmoked;
    private Integer cravingLevel;
    private String notes;
}