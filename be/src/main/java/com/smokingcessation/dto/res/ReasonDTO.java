package com.smokingcessation.dto.res;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReasonDTO {
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer userId;
    private Integer reasonId;
    @NotBlank(message = "Reason text must not be blank")
    private String reasonText;
    private Boolean isActive;
}