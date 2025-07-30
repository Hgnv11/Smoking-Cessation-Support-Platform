package com.smokingcessation.controller;

import com.smokingcessation.dto.res.BadgeDTO;
import com.smokingcessation.dto.res.ProgressMilestoneDTO;
import com.smokingcessation.model.User;
import com.smokingcessation.service.AchievementService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    @Operation(summary = "get huy hiệu")
    @GetMapping("/badges/{userId}")
    public ResponseEntity<List<BadgeDTO>> getUserBadges(@PathVariable Integer userId) {
        try {
            List<BadgeDTO> badges = achievementService.getUserBadges(userId);
            return ResponseEntity.ok(badges);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @Operation(summary = "api cho dev test nhanh xem user được huy hiệu/ đã có scheduler chạy và phát huy hiệu tự động mỗi ngày nên người dùng kh cần gọi api này")
    @PostMapping("/check-milestones")
    public ResponseEntity<Void> checkAndAwardMilestones(Principal principal) {
        try {
            achievementService.checkAndAwardMilestones(principal.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "lấy tổng số huy hiệu của 1 người dùng")
    @GetMapping("/achievements/{profileName}/total")
    public ResponseEntity<Integer> getTotalBadgesByProfileName(@PathVariable String profileName) {
        return ResponseEntity.ok(achievementService.getTotalBadgesByProfileName(profileName));
    }



}