package com.smokingcessation.controller;


import com.smokingcessation.model.SupportMeasure;
import com.smokingcessation.service.SupportMeasureService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/support-measures")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SupportMeasureFreeController {

    private final SupportMeasureService service;

    @GetMapping
    public List<SupportMeasure> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SupportMeasure getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public SupportMeasure create(@RequestBody SupportMeasure supportMeasure) {
        return service.create(supportMeasure);
    }

    @PutMapping("/{id}")
    public SupportMeasure update(@PathVariable Integer id, @RequestBody SupportMeasure updateData) {
        return service.update(id, updateData);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
