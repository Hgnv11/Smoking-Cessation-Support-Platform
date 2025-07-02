package com.smokingcessation.controller;

import com.smokingcessation.dto.UserSmokingProfileRequest;
import com.smokingcessation.dto.res.SavingDTO;
import com.smokingcessation.service.UserSmokingProfileService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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
    public ResponseEntity<List<UserSmokingProfileRequest>> getMyProfile(Principal principal) {
        String email = principal.getName();
        List<UserSmokingProfileRequest> profiles = userSmokingProfileService.getAllProfilesByEmail(email);
        return ResponseEntity.ok(profiles);
    }

    // Cập nhật profile của user đang đăng nhập
    @Operation(
            summary = "Thêm profile của user (1 lúc chỉ dc 1 user smoking profile)"
    )
    @PostMapping("/my")
    public ResponseEntity<UserSmokingProfileRequest> updateMyProfile(
            Principal principal,
            @RequestBody UserSmokingProfileRequest request) {
        String email = principal.getName();
        UserSmokingProfileRequest updatedProfile = userSmokingProfileService.AddProfileByEmail(email, request);
        return ResponseEntity.ok(updatedProfile);
    }

    @Operation(
            summary = "update user smoking profile "
    )
    @PutMapping
    public ResponseEntity<UserSmokingProfileRequest> updateProfile(
            Principal principal,
            @RequestBody UserSmokingProfileRequest request) {
        UserSmokingProfileRequest updated = userSmokingProfileService.UpdateProfileByEmail(principal.getName(), request);
        return ResponseEntity.ok(updated);
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
            summary = "Tính toán số tiền tiết kiệm được 7n/1t/1n khi người dùng add user smoker profile, kèm theo số tiền thực tế đã tiết kiệm được( đã trừ tiền số điếu thuốc mà user đã hút) "
    )
    @GetMapping("/calculate")
    public SavingDTO calculateSavings(Principal principal){
        return userSmokingProfileService.calculateSavings(principal.getName());
    }

}
