package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.model.Consultation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ConsultationMapper {

    @Mapping(source = "consultationId", target = "consultationId")
    @Mapping(source = "user", target = "user")
    @Mapping(source = "mentor", target = "mentor")
    ConsultationDTO toDto(Consultation consultation);
}
