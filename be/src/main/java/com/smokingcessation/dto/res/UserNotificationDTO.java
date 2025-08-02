package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserNotificationDTO {
    private Long notificationId;
    private String title;
    private String message;
    private String notificationType;
    private LocalDateTime createdAt;
    private LocalDateTime receivedAt;
    private Boolean isRead;
    private Boolean isHidden;
    private UserDTO sender;
}
