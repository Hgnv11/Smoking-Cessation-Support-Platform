package com.smokingcessation.controller;

import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.dto.res.ConsultationSlotDTO;
import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.model.Consultation;
import com.smokingcessation.model.ConsultationSlot;
import com.smokingcessation.model.User;
import com.smokingcessation.service.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final PostService postService;
    private final UserService userService;
    private final ReasonService reasonService;
    private final ConsultationSlotService slotService;
    private final ConsultationService consultationService;

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

    // ========== POST ==========

    @Operation(summary = "Duyệt bài viết")
    @PatchMapping("/posts/{postId}/approve")
    public ResponseEntity<?> approvePost(@PathVariable int postId) {
        return ResponseEntity.ok(postService.approvePost(postId));
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
}
