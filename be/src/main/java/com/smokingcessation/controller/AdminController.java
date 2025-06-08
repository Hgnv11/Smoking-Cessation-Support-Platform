package com.smokingcessation.controller;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.service.PostService;
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
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}