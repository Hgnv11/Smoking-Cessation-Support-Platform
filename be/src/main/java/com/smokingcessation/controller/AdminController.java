package com.smokingcessation.controller;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.model.User;
import com.smokingcessation.service.PostService;
import com.smokingcessation.service.ReasonService;
import com.smokingcessation.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final PostService postService;
    private final UserService userService;
    private final ReasonService reasonService;

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

    @Operation(summary = "Tạo lý do bỏ thuốc mới (Admin)")
    @PostMapping("/reasons")
    public ResponseEntity<ReasonDTO> createReason(@RequestBody ReasonDTO reasonDTO) {
        ReasonDTO createdReason = reasonService.createReason(reasonDTO);
        return ResponseEntity.ok(createdReason);
    }

    @Operation(summary = "Cập nhật lý do bỏ thuốc (Admin)")
    @PutMapping("/reasons/{reasonId}")
    public ResponseEntity<ReasonDTO> updateReason(
            @PathVariable Integer reasonId,
            @RequestBody ReasonDTO reasonDTO) {
        ReasonDTO updatedReason = reasonService.updateReason(reasonId, reasonDTO);
        return ResponseEntity.ok(updatedReason);
    }

    @Operation(summary = "Xóa lý do bỏ thuốc (Admin, soft delete)")
    @DeleteMapping("/reasons/{reasonId}")
    public ResponseEntity<String> deleteReason(@PathVariable Integer reasonId) {
        reasonService.deleteReason(reasonId);
        return ResponseEntity.ok("Reason soft deleted successfully");
    }
}