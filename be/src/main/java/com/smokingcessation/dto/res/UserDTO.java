package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private int userId;
    private String fullName;
    private String profileName;
    private String email;
    private Boolean isVerified;
    private LocalDate birthDate;
    private String avatarUrl;
    private String gender;
    private String note;

}
