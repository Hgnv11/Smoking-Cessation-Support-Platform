// UserDependencyScoreDTO.java
package com.smokingcessation.dto.res;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDependencyScoreDTO {
    private Integer scoreId;
    private Integer userId;
    private Integer totalScore;
    private String dependencyLevel;
}
