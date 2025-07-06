package com.smokingcessation.controller;

import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.service.ReasonService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reasons")
@RequiredArgsConstructor
public class ReasonController {

    private final ReasonService reasonService;

    @Operation(summary = "Lấy danh sách tất cả lý do bỏ thuốc (active)")
    @GetMapping
    public ResponseEntity<List<ReasonDTO>> getAllReasons() {
        List<ReasonDTO> reasons = reasonService.getAllReasons();
        return ResponseEntity.ok(reasons);
    }

    @Operation(summary = "Thêm nhiều lý do bỏ thuốc cho người dùng")
    @PostMapping("/user-reasons")
    public ResponseEntity<String> addMultipleReasonsForUser(
            Principal principal,
            @RequestBody List<Integer> reasonIds) {
        String email = principal.getName();
        reasonService.addMultipleReasonsForUser(email, reasonIds);
        return ResponseEntity.ok("Reasons added successfully for user");
    }


    @Operation(summary = "Lấy danh sách lý do bỏ thuốc của người dùng hiện tại (active)")
    @GetMapping("/my")
    public ResponseEntity<List<ReasonDTO>> getMyReasons(Principal principal) {
        String email = principal.getName();
        List<ReasonDTO> reasons = reasonService.getMyReasons(email);
        return ResponseEntity.ok(reasons);
    }

    @Operation(summary = "Lấy danh sách lý do bỏ thuốc của người dùng hiện tại (active)")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReasonDTO>> getMyReasons(@PathVariable Integer userId) {
        List<ReasonDTO> reasons = reasonService.getMyReasonsbyUserId(userId);
        return ResponseEntity.ok(reasons);
    }

    @Operation(summary = "xoá tất cả lý do bỏ thuốc của một user")
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteUserReasonsByUserId(@PathVariable Integer userId) {
        reasonService.deleteAllReasonsByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}