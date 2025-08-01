package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DependencyAnswerDTO {
    private Integer answerId;
    private String answerText;
    private Integer points;
    private Boolean isSelected = false;
}
