package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DependencyQuestionDTO {
    private Integer questionId;
    private String questionText;
    private List<DependencyAnswerDTO> answers;
}
