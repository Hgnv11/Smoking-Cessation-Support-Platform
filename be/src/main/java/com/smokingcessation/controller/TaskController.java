package com.smokingcessation.controller;

import com.smokingcessation.dto.res.TaskFreeResponseDTO;
import com.smokingcessation.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Tạo task cho người dùng free", description = "Tạo task theo ngày được chọn cho người dùng free dựa trên email (Principal)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tạo task thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "401", description = "Không xác thực")
    })
    @PostMapping("/free")
    public ResponseEntity<TaskFreeResponseDTO> createTaskForFreeUser(
            @Parameter(hidden = true) Principal principal,
            @Parameter(description = "Ngày muốn tạo task (định dạng yyyy-MM-dd)") @RequestParam LocalDate date) {
        TaskFreeResponseDTO response = taskService.createTaskForFreeUser(principal.getName(), date);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Lấy danh sách task của người dùng free", description = "Lấy tất cả task của người dùng free dựa theo email đăng nhập")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "401", description = "Không xác thực")
    })
    @GetMapping("/free")
    public ResponseEntity<List<TaskFreeResponseDTO>> getTasksByEmail(
            @Parameter(hidden = true) Principal principal) {
        List<TaskFreeResponseDTO> tasks = taskService.getTasksByEmail(principal.getName());
        return ResponseEntity.ok(tasks);
    }
}
