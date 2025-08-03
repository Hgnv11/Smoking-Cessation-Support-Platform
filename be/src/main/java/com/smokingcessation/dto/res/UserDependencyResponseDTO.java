// UserDependencyResponseDTO.java
package com.smokingcessation.dto.res;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDependencyResponseDTO {
    private Integer responseId;
    private Integer userId;
    private Integer questionId;
    private Integer answerId;
    private String answerText;
    private Integer points;
}
