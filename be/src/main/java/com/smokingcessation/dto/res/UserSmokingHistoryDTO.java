package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSmokingHistoryDTO {

    private Integer userId;
    private String email;
    private String fullName;
    private SmokingProfileDTO smokingProfile;
    private DependencyScoreDTO dependencyScore;
    private List<String> triggers;
    private List<String> reasonsForQuitting;
    private Long daysSinceLastSmoke;
    private List<SmokingEventDTO> smokingEvents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SmokingProfileDTO {
        private Integer cigarettesPerDay;
        private LocalDate quitDate;
        private LocalDate endDate;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DependencyScoreDTO {
        private Integer totalScore;
        private String dependencyLevel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SmokingEventDTO {
        private LocalDateTime eventDate;
        private Integer cigarettesSmoked;
    }
}