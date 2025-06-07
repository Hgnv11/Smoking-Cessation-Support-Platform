package com.smokingcessation.controller;

import com.smokingcessation.dto.LoginRequest;
import com.smokingcessation.dto.RegisterRequest;
import com.smokingcessation.dto.res.LoginDTO;
import com.smokingcessation.model.OtpToken;
import com.smokingcessation.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

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
    public ResponseEntity<LoginDTO> login(@Valid @RequestBody LoginRequest request) {
        LoginDTO loginDTO = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(loginDTO);
    }

    @Operation(
            summary = "gọi khi quên pass cần "
    )
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam @Email String email) throws Exception {
        authService.forgotPassword(email);
        return ResponseEntity.ok("OTP sent to your email for password reset.");
    }

    @Operation(
            summary = "gọi khi user đã đăng nhập và cần change pass "
    )
    @PostMapping("/reset-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> resetPassword(@RequestParam @NotBlank String email) throws Exception {
        authService.resetPassword(email);
        return ResponseEntity.ok("OTP sent to your email for password reset.");
    }
    @Operation(
            summary = "xác thực otp và be trả về 1 token tạm thời(TempToken) xác định xem ai cần đổi pass"
    )
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String otpCode, @RequestParam String purpose) {
        String tempToken = authService.verifyOtp(otpCode, OtpToken.Purpose.valueOf(purpose));
        return ResponseEntity.ok("TempToken" + tempToken);
    }
    @Operation(
            summary = "truyền token tạm thời đó, và new pass để đổi mk"
    )
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam @NotBlank String token, @RequestParam @NotBlank String newPassword) {
        authService.changePassword(token, newPassword);
        return ResponseEntity.ok("Password changed successfully.");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestParam @Email String email, @RequestParam String purpose) throws Exception {
        authService.resendOtp(email, OtpToken.Purpose.valueOf(purpose));
        return ResponseEntity.ok("OTP resent successfully.");
    }
}