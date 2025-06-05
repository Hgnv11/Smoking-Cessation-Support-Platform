package com.smokingcessation.controller;

import com.smokingcessation.dto.UserSmokingProfileRequest;
import com.smokingcessation.dto.res.SavingDTO;
import com.smokingcessation.service.UserSmokingProfileService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(
            summary = "Lấy profile smoker của user đang đăng nhập"
    )
    @GetMapping("/my")
    public ResponseEntity<UserSmokingProfileRequest> getMyProfile(Principal principal) {
        String email = principal.getName();
        UserSmokingProfileRequest profile = userSmokingProfileService.getProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    // Cập nhật profile của user đang đăng nhập
    @Operation(
            summary = "Cập nhật profile của user đang đăng nhập"
    )
    @PostMapping("/my")
    public ResponseEntity<UserSmokingProfileRequest> updateMyProfile(
            Principal principal,
            @RequestBody UserSmokingProfileRequest request) {
        String email = principal.getName();
        UserSmokingProfileRequest updatedProfile = userSmokingProfileService.AddOrUpdateProfileByEmail(email, request);
        return ResponseEntity.ok(updatedProfile);
    }

    @Operation(
            summary = "xem profile của user, cho role=memtor theo dõi"
    )
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/{profileName}")
    public ResponseEntity<UserSmokingProfileRequest> getUserProfileByProfileName(@PathVariable String profileName) {
        UserSmokingProfileRequest profile = userSmokingProfileService.getProfileByProfileName(profileName);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "lay số ngày từ khi kế hoạch được tạo ra"
    )
    @GetMapping("/day")
    public ResponseEntity<Long> getDate(Principal principal) {
        String email = principal.getName();
        Long date = userSmokingProfileService.getDaysOnQuitPlan(email);
        return ResponseEntity.ok(date);
    }

    @Operation(
            summary = "Tính toán số tiền giả sua được khi người dùng add user smoker profile, kèm theo số tiền thực tế đã tiết kiệm được"
    )
    @GetMapping("/calculate")
    public SavingDTO calculateSavings(Principal principal){
        return userSmokingProfileService.calculateSavings(principal.getName());
    }



}
