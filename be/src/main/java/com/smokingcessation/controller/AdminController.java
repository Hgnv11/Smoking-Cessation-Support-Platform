package com.smokingcessation.controller;

import com.smokingcessation.dto.res.*;
import com.smokingcessation.model.*;
import com.smokingcessation.service.*;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://smoking-cessation-deploy-e2pi.vercel.app",
        "https://smokingcessationsupport.space"
})
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final PostService postService;
    private final UserService userService;
    private final ReasonService reasonService;
    private final ConsultationSlotService slotService;
    private final ConsultationService consultationService;
    private final TriggerService triggerService;
    private final StrategyService strategyService;
    private final SmokingEventService smokingEventService;
    private final AchievementService achievementService;

    // ========== USER CRUD ==========

    @Operation(summary = "Lấy danh sách tất cả người dùng")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Lấy thông tin người dùng theo ID")
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.findUserEntityById(userId));
    }

    @Operation(summary = "Cập nhật người dùng (không cập nhật email & password)")
    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Integer userId, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUserEntity(userId, updatedUser));
    }

    @Operation(summary = "Xoá mềm người dùng (theo ID)")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> softDeleteUser(@PathVariable Integer userId) {
        userService.softDeleteUserById(userId);
        return ResponseEntity.ok("User soft deleted successfully");
    }

    @Operation(summary = "Tạo người dùng mới (chỉ dành cho admin)")
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        return ResponseEntity.ok(userService.saveUser(newUser));
    }

    @Operation(summary = "Cập nhật vai trò người dùng (bằng chuỗi)")
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String newRole
    ) {
        userService.updateUserRoleByUserId(userId, newRole);
        return ResponseEntity.ok("User role updated successfully");
    }

    @Operation(summary = "Lấy danh sách tất cả mentor")
    @GetMapping("/mentors")
    public ResponseEntity<List<User>> getAllMentors() {
        return ResponseEntity.ok(userService.getAllMentors());
    }

    @Operation(summary = "Chi tiết các kết hoạch cai thuốc của user")
    @GetMapping("/smoking-progress/user/{UserId}")
    public ResponseEntity<List<SmokingProgressDTO>> getProgressByEmail(@PathVariable Integer UserId) {
        List<SmokingProgressDTO> progressList = smokingEventService.getAllSmokingProgressByUser(UserId);
        return ResponseEntity.ok(progressList);
    }

    // ========== POST ==========

    @Operation(summary = "Duyệt bài viết")
    @PatchMapping("/posts/{postId}/approve")
    public ResponseEntity<?> approvePost(@PathVariable int postId) {
        return ResponseEntity.ok(postService.approvePost(postId));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePostByAdmin(@PathVariable int postId) {
        postService.deletePostByAdmin(postId);
        return ResponseEntity.ok("Post deleted successfully by admin");
    }

    // ========== REASONS ==========

    @Operation(summary = "Tạo lý do bỏ thuốc mới")
    @PostMapping("/reasons")
    public ResponseEntity<ReasonDTO> createReason(@RequestBody ReasonDTO reasonDTO) {
        return ResponseEntity.ok(reasonService.createReason(reasonDTO));
    }

    @Operation(summary = "Cập nhật lý do bỏ thuốc")
    @PutMapping("/reasons/{reasonId}")
    public ResponseEntity<ReasonDTO> updateReason(
            @PathVariable Integer reasonId,
            @RequestBody ReasonDTO reasonDTO) {
        return ResponseEntity.ok(reasonService.updateReason(reasonId, reasonDTO));
    }

    @Operation(summary = "Xóa lý do bỏ thuốc (soft delete)")
    @DeleteMapping("/reasons/{reasonId}")
    public ResponseEntity<String> deleteReason(@PathVariable Integer reasonId) {
        reasonService.deleteReason(reasonId);
        return ResponseEntity.ok("Reason soft deleted successfully");
    }

    // ========== CONSULTATION SLOTS ==========

    @Operation(summary = "Tạo một slot tư vấn")
    @PostMapping("/consultation-slots")
    public ResponseEntity<ConsultationSlotDTO> createSlot(
            @RequestParam String mentorEmail,
            @RequestParam Integer slotNumber,
            @RequestParam LocalDate slotDate) {
        return ResponseEntity.ok(slotService.createSlot(mentorEmail, slotNumber, slotDate));
    }

    @Operation(summary = "Tạo nhiều slot tư vấn")
    @PostMapping("/consultation-slots/batch")
    public ResponseEntity<List<ConsultationSlotDTO>> createMultipleSlots(
            @RequestParam String mentorEmail,
            @RequestParam List<Integer> slotNumbers,
            @RequestParam List<LocalDate> dates) {
        return ResponseEntity.ok(slotService.createMultipleSlots(mentorEmail, slotNumbers, dates));
    }

    @Operation(summary = "Cập nhật slot tư vấn")
    @PutMapping("/consultation-slots/{slotId}")
    public ResponseEntity<ConsultationSlotDTO> updateSlot(
            @PathVariable Integer slotId,
            @RequestParam(required = false) Integer slotNumber,
            @RequestParam(required = false) LocalDate slotDate,
            @RequestParam(required = false) String mentorEmail) {
        return ResponseEntity.ok(slotService.updateSlot(slotId, slotNumber, slotDate, mentorEmail));
    }

    @Operation(summary = "Xóa slot tư vấn")
    @DeleteMapping("/consultation-slots/{slotId}")
    public ResponseEntity<String> deleteSlot(@PathVariable Integer slotId) {
        slotService.deleteSlot(slotId);
        return ResponseEntity.ok("Slot deleted successfully");
    }

    // ========== CONSULTATION ==========

    @Operation(summary = "Lấy danh sách feedback và rating của mentor")
    @GetMapping("/mentors/{mentorId}/feedback")
    public ResponseEntity<List<ConsultationDTO>> getMentorFeedback(@PathVariable Integer mentorId) {
        return ResponseEntity.ok(consultationService.getMentorRatingsAndFeedback(mentorId));
    }

    @Operation(summary = "Cập nhật trạng thái tư vấn")
    @PatchMapping("/consultations/{consultationId}/status")
    public ResponseEntity<ConsultationDTO> updateConsultationStatus(
            @RequestParam String updaterEmail,
            @PathVariable Integer consultationId,
            @RequestParam Consultation.Status status) {
        return ResponseEntity.ok(consultationService.updateConsultationStatus(updaterEmail, consultationId, status));
    }

    @Operation(summary = "Xem tất cả slot của một mentor (dùng mentorId)")
    @GetMapping("/mentor/{mentorId}/slots/all")
    public ResponseEntity<List<ConsultationSlotDTO>> getAllSlotsByMentorId(@PathVariable Integer mentorId) {
        List<ConsultationSlotDTO> slots = slotService.getSlotsByMentorId(mentorId);
        return ResponseEntity.ok(slots);
    }


    // ========== TRIGGER ==========

    @Operation(summary = "Tạo trigger mới (cần categoryId)")
    @PostMapping("/triggers")
    public ResponseEntity<Trigger> createTrigger(
            @RequestParam String name,
            @RequestParam Integer categoryId) {
        return ResponseEntity.ok(triggerService.createTrigger(name, categoryId));
    }

    @Operation(summary = "Cập nhật trigger (cần categoryId)")
    @PutMapping("/triggers/{id}")
    public ResponseEntity<Trigger> updateTrigger(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam Integer categoryId) {
        return ResponseEntity.ok(triggerService.updateTrigger(id, name, categoryId));
    }

    @Operation(summary = "Xóa trigger")
    @DeleteMapping("/triggers/{id}")
    public ResponseEntity<Void> deleteTrigger(@PathVariable Integer id) {
        triggerService.deleteTrigger(id);
        return ResponseEntity.noContent().build();
    }

    // ========== TRIGGER CATEGORY ==========

    @Operation(summary = "Tạo mới danh mục trigger")
    @PostMapping("/trigger-categories")
    public ResponseEntity<TriggerCategory> createCategory(@RequestParam String name) {
        return ResponseEntity.ok(triggerService.createCategory(name));
    }

    @Operation(summary = "Cập nhật danh mục trigger")
    @PutMapping("/trigger-categories/{categoryId}")
    public ResponseEntity<TriggerCategory> updateCategory(
            @PathVariable Integer categoryId,
            @RequestParam String name) {
        return ResponseEntity.ok(triggerService.updateCategory(categoryId, name));
    }

    @Operation(summary = "Xóa danh mục trigger")
    @DeleteMapping("/trigger-categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        triggerService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ========== STRATEGY ==========

    @Operation(summary = "Tạo strategy mới (cần categoryId)")
    @PostMapping("/strategies")
    public ResponseEntity<Strategy> createStrategy(
            @RequestParam String name,
            @RequestParam Integer categoryId) {
        return ResponseEntity.ok(strategyService.createStrategy(name, categoryId));
    }

    @Operation(summary = "Cập nhật strategy (cần categoryId)")
    @PutMapping("/strategies/{id}")
    public ResponseEntity<Strategy> updateStrategy(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam Integer categoryId) {
        return ResponseEntity.ok(strategyService.updateStrategy(id, name, categoryId));
    }

    @Operation(summary = "Xóa strategy")
    @DeleteMapping("/strategies/{id}")
    public ResponseEntity<Void> deleteStrategy(@PathVariable Integer id) {
        strategyService.deleteStrategy(id);
        return ResponseEntity.noContent().build();
    }

    // ========== STRATEGY CATEGORY ==========

    @Operation(summary = "Tạo mới danh mục strategy")
    @PostMapping("/strategy-categories")
    public ResponseEntity<StrategyCategory> createStrategyCategory(@RequestParam String name) {
        return ResponseEntity.ok(strategyService.createCategory(name));
    }

    @Operation(summary = "Cập nhật danh mục strategy")
    @PutMapping("/strategy-categories/{categoryId}")
    public ResponseEntity<StrategyCategory> updateStrategyCategory(
            @PathVariable Integer categoryId,
            @RequestParam String name) {
        return ResponseEntity.ok(strategyService.updateCategory(categoryId, name));
    }

    @Operation(summary = "Xóa danh mục strategy")
    @DeleteMapping("/strategy-categories/{id}")
    public ResponseEntity<Void> deleteStrategyCategory(@PathVariable Integer id) {
        strategyService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ========== ACHIEVEMENTS ==========
    @Operation(summary = "update huy hiệu")
    @PutMapping("/badges/{badgeId}")
    public ResponseEntity<?> updateBadge(@PathVariable Long badgeId,
                                         @Valid @RequestBody Badge badge) {
        achievementService.updateBadge(badgeId, badge);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "get all badge")
    @GetMapping("/badges")
    public ResponseEntity<List<Badge>> getAllBadges() {
        return ResponseEntity.ok(achievementService.getAllBadges());
    }



}
