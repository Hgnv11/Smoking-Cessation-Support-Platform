package com.smokingcessation.controller;

import com.smokingcessation.dto.res.TaskFreeResponseDTO;
import com.smokingcessation.dto.res.CreateTaskFreeDTO;
import com.smokingcessation.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/free")
    public ResponseEntity<TaskFreeResponseDTO> createTaskForFreeUser(Principal principal, @RequestParam LocalDate date) {
        TaskFreeResponseDTO response = taskService.createTaskForFreeUser(principal.getName(), date);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/free")
    public ResponseEntity<List<TaskFreeResponseDTO>> getTasksByEmail(Principal principal) {
        List<TaskFreeResponseDTO> tasks = taskService.getTasksByEmail(principal.getName());
        return ResponseEntity.ok(tasks);
    }
}