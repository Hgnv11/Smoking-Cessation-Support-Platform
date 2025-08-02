package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.PlanTasksProDTO;
import com.smokingcessation.model.PlanTasksPro;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PlanTasksProMapper {

    PlanTasksProMapper INSTANCE = Mappers.getMapper(PlanTasksProMapper.class);

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "mentor.userId", target = "mentorId")
    @Mapping(source = "status", target = "status")
    PlanTasksProDTO toDto(PlanTasksPro planTasksPro);

    @Mapping(source = "userId", target = "user.userId")
    @Mapping(source = "mentorId", target = "mentor.userId")
    @Mapping(source = "status", target = "status")
    PlanTasksPro toEntity(PlanTasksProDTO planTasksProDTO);
}