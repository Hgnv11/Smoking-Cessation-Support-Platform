package com.smokingcessation.dto.res;

import lombok.Data;

@Data
public class ReasonDTO {
    private Integer userId;
    private Integer reasonId;
    private String reasonText;
    private Boolean isActive;
}