package com.smokingcessation.controller;

import com.smokingcessation.dto.res.UserTriggerDTO;
import com.smokingcessation.service.UserTriggerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user-triggers")
@RequiredArgsConstructor
public class UserTriggerController {

    private final UserTriggerService userTriggerService;

    @Operation(summary = "Tạo nhiều user trigger cho người dùng hiện tại")
    @PostMapping("/bulk")
    public ResponseEntity<List<UserTriggerDTO>> createMultipleUserTriggers(
            Principal principal,
            @RequestBody List<Integer> triggerIds
    ) {
        List<UserTriggerDTO> userTriggerDTOs = userTriggerService.createMultipleUserTriggersByEmail(principal.getName(), triggerIds);
        return ResponseEntity.ok(userTriggerDTOs);
    }

    @Operation(summary = "Lấy danh sách trigger theo userId MENTOR")
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<UserTriggerDTO>> getUserTriggersByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(userTriggerService.getUserTriggersByUserId(userId));
    }

    @Operation(summary = "Lấy danh sách trigger theo user hiện tại (group theo category)")
    @GetMapping("/my")
    public ResponseEntity<List<UserTriggerDTO>> getUserTriggersByCurrentUser(Principal principal) {
        return ResponseEntity.ok(userTriggerService.getUserTriggersByEmail(principal.getName()));
    }

    @Operation(summary = "cập nhật user trigger dựa trên các trigger được chọn")
    @PutMapping("/sync")
    public ResponseEntity<List<UserTriggerDTO>> syncUserTriggers(
            Principal principal,
            @RequestBody List<Integer> selectedTriggerIds
    ) {
        List<UserTriggerDTO> userTriggerDTOs = userTriggerService.syncUserTriggersByEmail(
                principal.getName(),
                selectedTriggerIds
        );
        return ResponseEntity.ok(userTriggerDTOs);
    }

    @Operation(summary = "xóa tất cả trigger của một user")
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteUserTriggersByUserId(@PathVariable Integer userId) {
        userTriggerService.deleteAllUserTriggersByUserId(userId);
        return ResponseEntity.noContent().build();
    }


}
