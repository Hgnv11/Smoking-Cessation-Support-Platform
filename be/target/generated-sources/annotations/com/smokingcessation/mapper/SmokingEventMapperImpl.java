package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.SmokingEventDTO;
import com.smokingcessation.model.SmokingEvent;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-02T15:45:32+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class SmokingEventMapperImpl implements SmokingEventMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public SmokingEventDTO toDto(SmokingEvent smokingEvent) {
        if ( smokingEvent == null ) {
            return null;
        }

        SmokingEventDTO smokingEventDTO = new SmokingEventDTO();

        smokingEventDTO.setEventId( smokingEvent.getEventId() );
        smokingEventDTO.setUser( userMapper.toDto( smokingEvent.getUser() ) );
        smokingEventDTO.setEventTime( smokingEvent.getEventTime() );
        smokingEventDTO.setCigarettesSmoked( smokingEvent.getCigarettesSmoked() );
        smokingEventDTO.setCravingLevel( smokingEvent.getCravingLevel() );
        smokingEventDTO.setNotes( smokingEvent.getNotes() );

        return smokingEventDTO;
    }

    @Override
    public SmokingEvent toEntity(SmokingEventDTO smokingEventDTO) {
        if ( smokingEventDTO == null ) {
            return null;
        }

        SmokingEvent smokingEvent = new SmokingEvent();

        smokingEvent.setEventId( smokingEventDTO.getEventId() );
        smokingEvent.setUser( userMapper.toEntity( smokingEventDTO.getUser() ) );
        smokingEvent.setEventTime( smokingEventDTO.getEventTime() );
        smokingEvent.setCigarettesSmoked( smokingEventDTO.getCigarettesSmoked() );
        smokingEvent.setCravingLevel( smokingEventDTO.getCravingLevel() );
        smokingEvent.setNotes( smokingEventDTO.getNotes() );

        return smokingEvent;
    }
}
