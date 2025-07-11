package com.smokingcessation.controller;

import com.smokingcessation.dto.res.LoginDTO;
import com.smokingcessation.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "google-auth-controller", description = "Google OAuth2 Login")
@RestController
public class GoogleAuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/api/auth/google/success")
    public LoginDTO handleGoogleSuccess(@AuthenticationPrincipal OAuth2User principal) {
        return authService.handleGoogleLogin(principal);
    }

    @Operation(
            summary = "Login bằng Google",
            description = "Redirect sang Google để xác thực OAuth2. Sau khi login thành công, hệ thống sẽ chuyển hướng đến /api/auth/google/success."
    )
    @GetMapping("/oauth2/authorization/google")
    public void googleLogin() {
    }
}
