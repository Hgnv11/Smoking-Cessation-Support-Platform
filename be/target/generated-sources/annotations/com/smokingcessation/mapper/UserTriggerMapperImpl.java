package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserTriggerDTO;
import com.smokingcessation.model.UserTrigger;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-02T15:45:32+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class UserTriggerMapperImpl implements UserTriggerMapper {

    @Override
    public UserTriggerDTO toDto(UserTrigger userTrigger) {
        if ( userTrigger == null ) {
            return null;
        }

        UserTriggerDTO.UserTriggerDTOBuilder userTriggerDTO = UserTriggerDTO.builder();

        return userTriggerDTO.build();
    }

    @Override
    public UserTrigger toEntity(UserTriggerDTO userTriggerDTO) {
        if ( userTriggerDTO == null ) {
            return null;
        }

        UserTrigger.UserTriggerBuilder userTrigger = UserTrigger.builder();

        return userTrigger.build();
    }
}
