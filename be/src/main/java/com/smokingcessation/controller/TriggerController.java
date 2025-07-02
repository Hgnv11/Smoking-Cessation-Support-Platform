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

    @Operation(summary = "Lấy tất cả danh mục trigger kèm danh sách trigger")
    @GetMapping("/categories")
    public ResponseEntity<List<TriggerCategory>> getAllCategories() {
        return ResponseEntity.ok(triggerService.getAllCategories());
    }

    // ====== TRIGGER ======

    @Operation(summary = "Lấy trigger theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<Trigger> getTriggerById(@PathVariable Integer id) {
        return triggerService.getTriggerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ====== NEW: Get Triggers by Category ID ======

    @Operation(summary = "Lấy danh sách trigger theo danh mục")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Trigger>> getTriggersByCategoryId(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(triggerService.getTriggersByCategoryId(categoryId));
    }
}