// dto/RegisterRequest.java
package com.smokingcessation.dto;

import jakarta.validation.constraints.*;
import lombok.Data;


@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
    private String password;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    @NotBlank
    @Size(max = 100)
    private String profileName;

}