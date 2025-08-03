package com.smokingcessation.controller;

import com.smokingcessation.model.Strategy;
import com.smokingcessation.model.StrategyCategory;
import com.smokingcessation.service.StrategyService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/strategies")
@RequiredArgsConstructor
public class StrategyController {

    private final StrategyService strategyService;

    @Operation(summary = "Lấy tất cả danh mục chiến lược kèm danh sách chiến lược")
    @GetMapping("/categories")
    public ResponseEntity<List<StrategyCategory>> getAllCategories() {
        return ResponseEntity.ok(strategyService.getAllCategories());
    }

    @Operation(summary = "Lấy chiến lược theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<Strategy> getStrategyById(@PathVariable Integer id) {
        return strategyService.getStrategyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Lấy danh sách chiến lược theo danh mục")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Strategy>> getStrategiesByCategoryId(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(strategyService.getStrategiesByCategoryId(categoryId));
    }
}