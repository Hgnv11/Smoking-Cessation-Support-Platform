package com.smokingcessation.controller;

import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.dto.res.ConsultationSlotDTO;
import com.smokingcessation.dto.res.PostDTO;
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

    @Operation(summary = "Duyệt bài viết")
    @PatchMapping("/post/{postId}/approve")
    public ResponseEntity<PostDTO> approvePost(@PathVariable int postId) {
        PostDTO approvedPost = postService.approvePost(postId);
        return ResponseEntity.ok(approvedPost);
    }

    @Operation(summary = "Cập nhật vai trò người dùng")
    @PutMapping("/user/{userId}/role")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String newRole) {
        userService.updateUserRoleByUserId(userId, newRole);
        return ResponseEntity.ok("User role updated successfully");
    }

    @Operation(summary = "Lấy danh sách tất cả người dùng")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Lấy danh sách tất cả mentor")
    @GetMapping("/mentors")
    public ResponseEntity<List<User>> getAllMentors() {
        List<User> mentors = userService.getAllMentors();
        return ResponseEntity.ok(mentors);
    }

    @Operation(summary = "Tạo lý do bỏ thuốc mới")
    @PostMapping("/reasons")
    public ResponseEntity<ReasonDTO> createReason(@RequestBody ReasonDTO reasonDTO) {
        ReasonDTO createdReason = reasonService.createReason(reasonDTO);
        return ResponseEntity.ok(createdReason);
    }

    @Operation(summary = "Cập nhật lý do bỏ thuốc")
    @PutMapping("/reasons/{reasonId}")
    public ResponseEntity<ReasonDTO> updateReason(
            @PathVariable Integer reasonId,
            @RequestBody ReasonDTO reasonDTO) {
        ReasonDTO updatedReason = reasonService.updateReason(reasonId, reasonDTO);
        return ResponseEntity.ok(updatedReason);
    }

    @Operation(summary = "Xóa lý do bỏ thuốc (soft delete)")
    @DeleteMapping("/reasons/{reasonId}")
    public ResponseEntity<String> deleteReason(@PathVariable Integer reasonId) {
        reasonService.deleteReason(reasonId);
        return ResponseEntity.ok("Reason soft deleted successfully");
    }

    @Operation(summary = "Tạo một slot tư vấn")
    @PostMapping("/consultation-slots")
    public ResponseEntity<ConsultationSlotDTO> createSlot(
            @RequestParam String mentorEmail,
            @RequestParam Integer slotNumber,
            @RequestParam LocalDate slotDate) {
        ConsultationSlotDTO slot = slotService.createSlot(mentorEmail, slotNumber, slotDate);
        return ResponseEntity.ok(slot);
    }

    @Operation(summary = "Tạo nhiều slot tư vấn")
    @PostMapping("/consultation-slots/batch")
    public ResponseEntity<List<ConsultationSlotDTO>> createMultipleSlots(
            @RequestParam String mentorEmail,
            @RequestParam List<Integer> slotNumbers,
            @RequestParam List<LocalDate> dates) {
        List<ConsultationSlotDTO> slots = slotService.createMultipleSlots(mentorEmail, slotNumbers, dates);
        return ResponseEntity.ok(slots);
    }

    @Operation(summary = "Cập nhật slot tư vấn")
    @PutMapping("/consultation-slots/{slotId}")
    public ResponseEntity<ConsultationSlotDTO> updateSlot(
            @PathVariable Integer slotId,
            @RequestParam(required = false) Integer slotNumber,
            @RequestParam(required = false) LocalDate slotDate,
            @RequestParam(required = false) String mentorEmail) {
        ConsultationSlotDTO slot = slotService.updateSlot(slotId, slotNumber, slotDate, mentorEmail);
        return ResponseEntity.ok(slot);
    }

    @Operation(summary = "Xóa slot tư vấn")
    @DeleteMapping("/consultation-slots/{slotId}")
    public ResponseEntity<String> deleteSlot(@PathVariable Integer slotId) {
        slotService.deleteSlot(slotId);
        return ResponseEntity.ok("Slot deleted successfully");
    }

    @Operation(summary = "Lấy danh sách feedback và rating của mentor")
    @GetMapping("/mentor/{mentorId}/feedback")
    public ResponseEntity<List<ConsultationDTO>> getMentorFeedback(@PathVariable Integer mentorId) {
        return ResponseEntity.ok(consultationService.getMentorRatingsAndFeedback(mentorId));
    }

    @Operation(summary = "Cập nhật trạng thái tư vấn")
    @PatchMapping("/consultations/{consultationId}/status")
    public ResponseEntity<ConsultationDTO> updateStatus(
            @RequestParam String updaterEmail,
            @PathVariable Integer consultationId,
            @RequestParam Consultation.Status status) {
        return ResponseEntity.ok(consultationService.updateConsultationStatus(updaterEmail, consultationId, status));
    }
}