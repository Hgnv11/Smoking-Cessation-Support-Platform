package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserNotificationDTO;
import com.smokingcessation.model.UserNotification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = UserMapper.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserNotificationMapper {

    @Mapping(source = "notification.notificationId", target = "notificationId")
    @Mapping(source = "notification.title", target = "title")
    @Mapping(source = "notification.message", target = "message")
    @Mapping(source = "notification.notificationType", target = "notificationType", qualifiedByName = "enumToString")
    @Mapping(source = "notification.createdAt", target = "createdAt")
    @Mapping(source = "receivedAt", target = "receivedAt")
    @Mapping(source = "isRead", target = "isRead")
    @Mapping(source = "isHidden", target = "isHidden")
    @Mapping(source = "notification.sender", target = "sender")
    UserNotificationDTO toDto(UserNotification entity);

    @Named("enumToString")
    static String enumToString(Enum<?> e) {
        return e != null ? e.name() : null;
    }
}
