package com.smokingcessation.controller;

import com.smokingcessation.dto.res.BadgeDTO;
import com.smokingcessation.dto.res.ProgressMilestoneDTO;
import com.smokingcessation.service.AchievementService;
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

    @GetMapping("/milestones/{userId}")
    public ResponseEntity<List<ProgressMilestoneDTO>> getUserMilestones(@PathVariable Integer userId) {
        try {
            List<ProgressMilestoneDTO> milestones = achievementService.getUserMilestones(userId);
            return ResponseEntity.ok(milestones);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/badges/{userId}")
    public ResponseEntity<List<BadgeDTO>> getUserBadges(@PathVariable Integer userId) {
        try {
            List<BadgeDTO> badges = achievementService.getUserBadges(userId);
            return ResponseEntity.ok(badges);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/check-milestones")
    public ResponseEntity<Void> checkAndAwardMilestones(Principal principal) {
        try {
            achievementService.checkAndAwardMilestones(principal.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}