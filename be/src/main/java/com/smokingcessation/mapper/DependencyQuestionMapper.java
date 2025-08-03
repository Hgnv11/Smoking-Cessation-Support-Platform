package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.DependencyQuestionDTO;
import com.smokingcessation.model.DependencyQuestion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = DependencyAnswerMapper.class)
public interface DependencyQuestionMapper {
    DependencyQuestionDTO toDto(DependencyQuestion entity);
    DependencyQuestion toEntity(DependencyQuestionDTO dto);
}
