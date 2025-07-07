package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.ConsultationSlotDTO;
import com.smokingcessation.model.ConsultationSlot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ConsultationSlotMapper {

    @Mapping(source = "mentor", target = "mentor")
    @Mapping(source = "isBooked", target = "booked")
    ConsultationSlotDTO toDto(ConsultationSlot slot);
}
