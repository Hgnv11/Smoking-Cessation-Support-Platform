package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.DependencyAnswerDTO;
import com.smokingcessation.model.DependencyAnswer;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DependencyAnswerMapper {
    DependencyAnswerDTO toDto(DependencyAnswer entity);
    DependencyAnswer toEntity(DependencyAnswerDTO dto);
}
