package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.model.Consultation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ConsultationSlotMapper.class})
public interface ConsultationMapper {

    @Mapping(source = "consultationId", target = "consultationId")
    @Mapping(source = "user", target = "user")
    @Mapping(source = "slot", target = "consultationSlot")
    ConsultationDTO toDto(Consultation consultation);
}

