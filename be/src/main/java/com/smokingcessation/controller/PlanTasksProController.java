package com.smokingcessation.controller;

import com.smokingcessation.dto.res.PlanTasksProDTO;
import com.smokingcessation.dto.res.UserSmokingHistoryDTO;
import com.smokingcessation.service.PlanTasksProService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/plan-tasks-pro")
@RequiredArgsConstructor
public class PlanTasksProController {

    private final PlanTasksProService planTasksProService;

    @Operation(summary = "Mentor gán task cho user pro")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Gán task thành công"),
            @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @PostMapping("/assign")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<PlanTasksProDTO> assignTask(
            @Parameter(hidden = true) Principal userDetails,
            @RequestBody PlanTasksProDTO request) {
        String mentorEmail = userDetails.getName();
        PlanTasksProDTO task = planTasksProService.assignTask(mentorEmail, request);
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Mentor lấy danh sách task của 1 user cụ thể do chính mình gán")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "403", description = "Không có quyền")
    })
    @GetMapping("/mentor/{userId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<PlanTasksProDTO>> getTasksByUserAndMentor(
            @Parameter(hidden = true) Principal userDetails,
            @Parameter(description = "ID người dùng") @PathVariable Integer userId) {
        String mentorEmail = userDetails.getName();
        List<PlanTasksProDTO> tasks = planTasksProService.getTasksByUserAndMentor(mentorEmail, userId);
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "User xem danh sách task được giao")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy thành công")
    })
    @GetMapping("/my-tasks")
    public ResponseEntity<List<PlanTasksProDTO>> getUserTasks(
            @Parameter(hidden = true) Principal userDetails) {
        String userEmail = userDetails.getName();
        List<PlanTasksProDTO> tasks = planTasksProService.getUserTasks(userEmail);
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Mentor cập nhật trạng thái task")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "403", description = "Không có quyền")
    })
    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<PlanTasksProDTO> updateTaskStatus(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "ID của task") @PathVariable Integer taskId,
            @Parameter(description = "Trạng thái mới") @RequestBody String newStatus) {
        String userEmail = userDetails.getUsername();
        PlanTasksProDTO task = planTasksProService.updateTaskStatus(userEmail, taskId, newStatus);
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Mentor xem lịch sử hút thuốc của user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy lịch sử thành công"),
            @ApiResponse(responseCode = "403", description = "Không có quyền")
    })
    @GetMapping("/smoking-history/{userId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<UserSmokingHistoryDTO> getUserSmokingHistory(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "ID người dùng") @PathVariable Integer userId) {
        String mentorEmail = userDetails.getUsername();
        UserSmokingHistoryDTO history = planTasksProService.getUserSmokingHistory(mentorEmail, userId);
        return ResponseEntity.ok(history);
    }

    @Operation(summary = "Mentor cập nhật nội dung task đã giao")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "403", description = "Không có quyền")
    })
    @PutMapping("/{taskId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<PlanTasksProDTO> updateTask(
            @Parameter(description = "ID của task") @PathVariable Integer taskId,
            @RequestBody PlanTasksProDTO request,
            @Parameter(hidden = true) Principal userPrincipal) {
        PlanTasksProDTO updatedTask = planTasksProService.updateTask(taskId, userPrincipal.getName(), request);
        return ResponseEntity.ok(updatedTask);
    }
}
