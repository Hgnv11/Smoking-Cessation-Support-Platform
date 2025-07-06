package com.smokingcessation.dto.res;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BadgeDTO {
    private Long badgeId;
    private String badgeType;
    private String badgeName;
    private String badgeDescription;
    private String badgeImageUrl;
    private boolean isActive;
    private LocalDateTime earnedDate;
}