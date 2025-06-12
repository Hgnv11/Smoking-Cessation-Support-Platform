package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginDTO {
    private String token;
    private int userId;
    private String email;
    private String role;
    private Boolean is_verified;
    private String profileName;
    private String avatarUrl;
}
