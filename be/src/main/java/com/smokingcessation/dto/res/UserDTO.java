package com.smokingcessation.dto.res;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String fullName;
    private String profileName;
    private String email;
    private LocalDate birthDate;
    private String gender;
}
