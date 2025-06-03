package com.smokingcessation.controller;

import com.smokingcessation.dto.UserSmokingProfileRequest;
import com.smokingcessation.service.UserSmokingProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user-smoking-profile")
public class UserSmokingProfileController {

    private final UserSmokingProfileService userSmokingProfileService;

    public UserSmokingProfileController(UserSmokingProfileService userSmokingProfileService) {
        this.userSmokingProfileService = userSmokingProfileService;
    }

    // Lấy profile smoker của user đang đăng nhập
    @GetMapping("/my")
    public ResponseEntity<UserSmokingProfileRequest> getMyProfile(Principal principal) {
        String email = principal.getName();
        UserSmokingProfileRequest profile = userSmokingProfileService.getProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    // Cập nhật profile của user đang đăng nhập
    @PostMapping("/my")
    public ResponseEntity<UserSmokingProfileRequest> updateMyProfile(
            Principal principal,
            @RequestBody UserSmokingProfileRequest request) {
        String email = principal.getName();
        UserSmokingProfileRequest updatedProfile = userSmokingProfileService.AddOrUpdateProfileByEmail(email, request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/{profileName}")
    public ResponseEntity<UserSmokingProfileRequest> getUserProfileByProfileName(@PathVariable String profileName) {
        UserSmokingProfileRequest profile = userSmokingProfileService.getProfileByProfileName(profileName);
        return ResponseEntity.ok(profile);
    }

}
