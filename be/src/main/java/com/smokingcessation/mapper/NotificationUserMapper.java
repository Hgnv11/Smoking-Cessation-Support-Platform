package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.NotificationUserDTO;
import com.smokingcessation.model.NotificationUser;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationUserMapper {
    NotificationUserDTO toDTO(NotificationUser notification);
    List<NotificationUserDTO> toDTOs(List<NotificationUser> notifications);
}
