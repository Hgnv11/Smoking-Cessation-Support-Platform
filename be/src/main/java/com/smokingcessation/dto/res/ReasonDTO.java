package com.smokingcessation.dto.res;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ReasonDTO {
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer userId;
    private Integer reasonId;
    private String reasonText;
    private Boolean isActive;
}