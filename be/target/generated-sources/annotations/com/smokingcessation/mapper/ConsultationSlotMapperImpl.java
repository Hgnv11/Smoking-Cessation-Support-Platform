package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.ConsultationSlotDTO;
import com.smokingcessation.model.ConsultationSlot;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-02T15:45:32+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class ConsultationSlotMapperImpl implements ConsultationSlotMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public ConsultationSlotDTO toDto(ConsultationSlot slot) {
        if ( slot == null ) {
            return null;
        }

        ConsultationSlotDTO.ConsultationSlotDTOBuilder consultationSlotDTO = ConsultationSlotDTO.builder();

        consultationSlotDTO.mentor( userMapper.toDto( slot.getMentor() ) );
        if ( slot.getSlotId() != null ) {
            consultationSlotDTO.slotId( slot.getSlotId() );
        }
        if ( slot.getSlotNumber() != null ) {
            consultationSlotDTO.slotNumber( slot.getSlotNumber() );
        }
        consultationSlotDTO.slotDate( slot.getSlotDate() );
        if ( slot.getIsBooked() != null ) {
            consultationSlotDTO.isBooked( slot.getIsBooked() );
        }
        consultationSlotDTO.createdAt( slot.getCreatedAt() );

        return consultationSlotDTO.build();
    }
}
