package com.smokingcessation.dto.res;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BadgeDTO {

    @NotNull(message = "Badge ID must not be null")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long badgeId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String badgeType;

    @NotBlank(message = "Badge name must not be blank")
    private String badgeName;

    @NotBlank(message = "Badge description must not be blank")
    private String badgeDescription;

    @NotBlank(message = "Badge image URL must not be blank")
    private String badgeImageUrl;

    private boolean isActive;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime earnedDate;
}
