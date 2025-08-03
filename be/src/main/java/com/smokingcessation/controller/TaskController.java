package com.smokingcessation.controller;

import com.smokingcessation.dto.res.TaskFreeCreateDTO;
import com.smokingcessation.dto.res.SupportMeasureResponseDTO;
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
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Lấy danh sách biện pháp hỗ trợ", description = "Lấy tất cả biện pháp hỗ trợ để người dùng chọn")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping("/support-measures")
    public ResponseEntity<List<SupportMeasureResponseDTO>> getAllSupportMeasures() {
        List<SupportMeasureResponseDTO> measures = taskService.getAllSupportMeasures();
        return ResponseEntity.ok(measures);
    }

    @Operation(summary = "Tạo task cho người dùng free", description = "Tạo task theo ngày được chọn với biện pháp hỗ trợ và số thuốc mục tiêu do người dùng chọn")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tạo task thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "401", description = "Không xác thực")
    })
    @PostMapping("/free")
    public ResponseEntity<TaskFreeResponseDTO> createTaskForFreeUser(
            @Parameter(hidden = true) Principal principal,
            @RequestBody TaskFreeCreateDTO createDTO) {
        TaskFreeResponseDTO response = taskService.createTaskForFreeUser(principal.getName(), createDTO);
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

    @Operation(summary = "Cập nhật task cho người dùng free", description = "Cập nhật task với thông tin mới")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cập nhật task thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "401", description = "Không xác thực"),
            @ApiResponse(responseCode = "404", description = "Task không tồn tại")
    })
    @PutMapping("/free/{taskId}")
    public ResponseEntity<TaskFreeResponseDTO> updateTaskForFreeUser(
            @Parameter(hidden = true) Principal principal,
            @PathVariable Integer taskId,
            @RequestBody TaskFreeCreateDTO updateDTO) {
        TaskFreeResponseDTO response = taskService.updateTaskForFreeUser(principal.getName(), taskId, updateDTO);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Xóa task cho người dùng free", description = "Xóa task dựa trên taskId")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xóa task thành công"),
            @ApiResponse(responseCode = "401", description = "Không xác thực"),
            @ApiResponse(responseCode = "404", description = "Task không tồn tại")
    })
    @DeleteMapping("/free/{taskId}")
    public ResponseEntity<Void> deleteTaskForFreeUser(
            @Parameter(hidden = true) Principal principal,
            @PathVariable Integer taskId) {
        taskService.deleteTaskForFreeUser(principal.getName(), taskId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/task-free/{taskId}/status")
    public ResponseEntity<TaskFreeResponseDTO> updateTaskStatus(
            Principal principal,
            @PathVariable Integer taskId,
            @RequestParam String status) {

        TaskFreeResponseDTO updatedTask = taskService.updateTaskStatusForUser(principal.getName(), taskId, status);
        return ResponseEntity.ok(updatedTask);
    }
}