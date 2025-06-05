package com.smokingcessation.controller;

import com.smokingcessation.dto.LoginRequest;
import com.smokingcessation.dto.RegisterRequest;
import com.smokingcessation.model.OtpToken;
import com.smokingcessation.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) throws Exception {
        authService.register(request.getEmail(), request.getPassword(), request.getFullName());
        return ResponseEntity.ok("Registration successful. Please verify your email with the OTP sent.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam @Email String email) throws Exception {
        authService.forgotPassword(email);
        return ResponseEntity.ok("OTP sent to your email for password reset.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String otpCode, @RequestParam @NotBlank String newPassword) {
        authService.resetPassword(otpCode, newPassword);
        return ResponseEntity.ok("Password reset successfully.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String otpCode, @RequestParam String purpose) {
        authService.verifyOtp(otpCode, OtpToken.Purpose.valueOf(purpose));
        return ResponseEntity.ok("OTP verified successfully.");
    }
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestParam @Email String email, @RequestParam String purpose) throws Exception {
        authService.resendOtp(email, OtpToken.Purpose.valueOf(purpose));
        return ResponseEntity.ok("OTP resent successfully.");
    }


}
