package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.NotificationUserDTO;
import com.smokingcessation.model.NotificationUser;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-16T17:01:47+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class NotificationUserMapperImpl implements NotificationUserMapper {

    @Override
    public NotificationUserDTO toDTO(NotificationUser notification) {
        if ( notification == null ) {
            return null;
        }

        NotificationUserDTO notificationUserDTO = new NotificationUserDTO();

        return notificationUserDTO;
    }

    @Override
    public List<NotificationUserDTO> toDTOs(List<NotificationUser> notifications) {
        if ( notifications == null ) {
            return null;
        }

        List<NotificationUserDTO> list = new ArrayList<NotificationUserDTO>( notifications.size() );
        for ( NotificationUser notificationUser : notifications ) {
            list.add( toDTO( notificationUser ) );
        }

        return list;
    }
}
