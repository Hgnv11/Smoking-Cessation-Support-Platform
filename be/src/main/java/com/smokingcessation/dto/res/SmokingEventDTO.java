package com.smokingcessation.dto.res;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Cigarettes smoked must not be null")
    @Min(value = 0, message = "Cigarettes smoked must be at least 0")
    private Integer cigarettesSmoked;

    @Min(value = 0, message = "Craving level must be at least 0")
    @Max(value = 10, message = "Craving level must be at most 10")
    private Integer cravingLevel;

    private String notes;
}
