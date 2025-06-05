package com.smokingcessation.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class OtpVerificationRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Pattern(regexp = "\\d{6}")
    private String otp;

    @NotBlank
    private String purpose;
}