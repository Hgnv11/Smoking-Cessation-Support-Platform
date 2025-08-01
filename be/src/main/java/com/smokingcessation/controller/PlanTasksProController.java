package com.smokingcessation.controller;

import com.smokingcessation.dto.res.PlanTasksProDTO;
import com.smokingcessation.dto.res.UserSmokingHistoryDTO;
import com.smokingcessation.service.PlanTasksProService;
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

    @PostMapping("/assign")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<PlanTasksProDTO> assignTask(
            Principal userDetails,
            @RequestBody PlanTasksProDTO request) {
        String mentorEmail = userDetails.getName();
        PlanTasksProDTO task = planTasksProService.assignTask(mentorEmail, request);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/mentor/{userId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<PlanTasksProDTO>> getTasksByUserAndMentor(
            Principal userDetails,
            @PathVariable Integer userId) {
        String mentorEmail = userDetails.getName();
        List<PlanTasksProDTO> tasks = planTasksProService.getTasksByUserAndMentor(mentorEmail, userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<PlanTasksProDTO>> getUserTasks(
            Principal userDetails) {
        String userEmail = userDetails.getName();
        List<PlanTasksProDTO> tasks = planTasksProService.getUserTasks(userEmail);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<PlanTasksProDTO> updateTaskStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer taskId,
            @RequestBody String newStatus) {
        String userEmail = userDetails.getUsername();
        PlanTasksProDTO task = planTasksProService.updateTaskStatus(userEmail, taskId, newStatus);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/smoking-history/{userId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<UserSmokingHistoryDTO> getUserSmokingHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer userId) {
        String mentorEmail = userDetails.getUsername();
        UserSmokingHistoryDTO history = planTasksProService.getUserSmokingHistory(mentorEmail, userId);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("hasRole('mentor')")
    public ResponseEntity<PlanTasksProDTO> updateTask(
            @PathVariable Integer taskId,
            @RequestBody PlanTasksProDTO request,
            Principal userPrincipal) {
        PlanTasksProDTO updatedTask = planTasksProService.updateTask(taskId, userPrincipal.getName(), request);
        return ResponseEntity.ok(updatedTask);
    }

}