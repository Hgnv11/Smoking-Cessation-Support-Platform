package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.SmokingEventDTO;
import com.smokingcessation.model.SmokingEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

    @Mapper(componentModel = "spring", uses = {UserMapper.class})
    public interface SmokingEventMapper {
        SmokingEventDTO toDto(SmokingEvent smokingEvent);
        SmokingEvent toEntity(SmokingEventDTO smokingEventDTO);
    }

