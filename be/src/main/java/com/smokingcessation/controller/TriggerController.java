package com.smokingcessation.controller;

import com.smokingcessation.model.Trigger;
import com.smokingcessation.model.TriggerCategory;
import com.smokingcessation.service.TriggerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/triggers")
@RequiredArgsConstructor
public class TriggerController {

    private final TriggerService triggerService;

    // ====== TRIGGER CATEGORY ======

    @Operation(summary = "Lấy tất cả danh mục trigger")
    @GetMapping("/categories")
    public ResponseEntity<List<TriggerCategory>> getAllCategories() {
        return ResponseEntity.ok(triggerService.getAllCategories());
    }

    @Operation(summary = "Lấy chi tiết danh mục trigger theo ID")
    @GetMapping("/categories/{id}")
    public ResponseEntity<TriggerCategory> getCategoryById(@PathVariable Integer id) {
        return triggerService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Tạo mới danh mục trigger")
    @PostMapping("/categories")
    public ResponseEntity<TriggerCategory> createCategory(@RequestBody TriggerCategory category) {
        return ResponseEntity.ok(triggerService.createCategory(category));
    }

    @Operation(summary = "Cập nhật danh mục trigger")
    @PutMapping("/categories/{id}")
    public ResponseEntity<TriggerCategory> updateCategory(@PathVariable Integer id, @RequestBody TriggerCategory updatedCategory) {
        return ResponseEntity.ok(triggerService.updateCategory(id, updatedCategory));
    }

    @Operation(summary = "Xóa danh mục trigger")
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        triggerService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ====== TRIGGER ======

    @Operation(summary = "Lấy tất cả trigger")
    @GetMapping
    public ResponseEntity<List<Trigger>> getAllTriggers() {
        return ResponseEntity.ok(triggerService.getAllTriggers());
    }

    @Operation(summary = "Lấy trigger theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<Trigger> getTriggerById(@PathVariable Integer id) {
        return triggerService.getTriggerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Tạo trigger mới (cần categoryId)")
    @PostMapping
    public ResponseEntity<Trigger> createTrigger(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Integer categoryId) {
        return ResponseEntity.ok(triggerService.createTrigger(name, description, categoryId));
    }

    @Operation(summary = "Cập nhật trigger (cần categoryId)")
    @PutMapping("/{id}")
    public ResponseEntity<Trigger> updateTrigger(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Integer categoryId) {
        return ResponseEntity.ok(triggerService.updateTrigger(id, name, description, categoryId));
    }

    @Operation(summary = "Xóa trigger")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrigger(@PathVariable Integer id) {
        triggerService.deleteTrigger(id);
        return ResponseEntity.noContent().build();
    }
}
