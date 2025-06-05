package com.smokingcessation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class PasswordResetRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Pattern(regexp = "\\d{6}")
    private String otp;

    @NotBlank
    @Size(min = 6, max = 20)
    private String newPassword;
}