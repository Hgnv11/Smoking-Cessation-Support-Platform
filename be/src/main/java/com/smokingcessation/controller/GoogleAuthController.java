package com.smokingcessation.controller;

import com.smokingcessation.dto.res.LoginDTO;
import com.smokingcessation.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/google")
public class GoogleAuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/success")
    public LoginDTO handleGoogleSuccess(@AuthenticationPrincipal OAuth2User principal) {
        return authService.handleGoogleLogin(principal);
    }
}