package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserTriggerDTO;
import com.smokingcessation.model.UserTrigger;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserTriggerMapper {

    UserTriggerDTO toDto(UserTrigger userTrigger);

    UserTrigger toEntity(UserTriggerDTO userTriggerDTO);
}