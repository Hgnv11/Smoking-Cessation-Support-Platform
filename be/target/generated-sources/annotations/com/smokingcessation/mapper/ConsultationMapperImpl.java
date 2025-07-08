package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.model.Consultation;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-07T20:06:20+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class ConsultationMapperImpl implements ConsultationMapper {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ConsultationSlotMapper consultationSlotMapper;

    @Override
    public ConsultationDTO toDto(Consultation consultation) {
        if ( consultation == null ) {
            return null;
        }

        ConsultationDTO.ConsultationDTOBuilder consultationDTO = ConsultationDTO.builder();

        if ( consultation.getConsultationId() != null ) {
            consultationDTO.consultationId( consultation.getConsultationId() );
        }
        consultationDTO.slot( consultationSlotMapper.toDto( consultation.getSlot() ) );
        consultationDTO.user( userMapper.toDto( consultation.getUser() ) );
        if ( consultation.getStatus() != null ) {
            consultationDTO.status( consultation.getStatus().name() );
        }
        consultationDTO.createdAt( consultation.getCreatedAt() );
        consultationDTO.rating( consultation.getRating() );
        consultationDTO.feedback( consultation.getFeedback() );
        consultationDTO.meetingLink( consultation.getMeetingLink() );
        consultationDTO.notes( consultation.getNotes() );

        return consultationDTO.build();
    }
}
