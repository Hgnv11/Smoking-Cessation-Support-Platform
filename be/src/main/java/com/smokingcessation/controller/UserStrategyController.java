package com.smokingcessation.controller;

import com.smokingcessation.dto.res.UserStrategyDTO;
import com.smokingcessation.service.UserStrategyService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user-strategies")
@RequiredArgsConstructor
public class UserStrategyController {

    private final UserStrategyService userStrategyService;

    @Operation(summary = "Tạo nhiều user strategy cho người dùng hiện tại")
    @PostMapping("/bulk")
    public ResponseEntity<List<UserStrategyDTO>> createMultipleUserStrategies(
            Principal principal,
            @RequestBody List<Integer> strategyIds
    ) {
        List<UserStrategyDTO> userStrategyDTOs = userStrategyService.createMultipleUserStrategiesByEmail(principal.getName(), strategyIds);
        return ResponseEntity.ok(userStrategyDTOs);
    }

    @Operation(summary = "Lấy danh sách strategy theo user hiện tại (group theo category)")
    @GetMapping("/my")
    public ResponseEntity<List<UserStrategyDTO>> getUserStrategiesByCurrentUser(Principal principal) {
        return ResponseEntity.ok(userStrategyService.getUserStrategiesByEmail(principal.getName()));
    }

    @Operation(summary = "Lấy danh sách strategy theo userId Mentor")
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<UserStrategyDTO>> getUserStrategiesByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(userStrategyService.getUserStrategiesByUserId(userId));
    }

    @Operation(summary = "Cap nhat user strategy dựa trên các strategy được chọn")
    @PutMapping("/sync")
    public ResponseEntity<List<UserStrategyDTO>> syncUserStrategies(
            Principal principal,
            @RequestBody List<Integer> selectedStrategyIds ) {
        List<UserStrategyDTO> userStrategyDTOs = userStrategyService.syncUserStrategiesByEmail(
                principal.getName(),
                selectedStrategyIds
        );
        return ResponseEntity.ok(userStrategyDTOs);
    }
}