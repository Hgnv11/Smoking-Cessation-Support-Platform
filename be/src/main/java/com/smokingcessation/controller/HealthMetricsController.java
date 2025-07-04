package com.smokingcessation.controller;

import com.smokingcessation.dto.res.HealthMetrics;
import com.smokingcessation.model.SmokingEvent;
import com.smokingcessation.repository.SmokingEventRepository;
import com.smokingcessation.service.HealthMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/health")
public class HealthMetricsController {

    @Autowired
    private HealthMetricsService healthMetricsService;

    @Autowired
    private SmokingEventRepository smokingEventRepository;

    @GetMapping("/metrics/{userId}")
    public ResponseEntity<HealthMetrics> getHealthMetrics(@PathVariable Integer userId) {
        HealthMetrics metrics = healthMetricsService.calculateHealthMetrics(userId, LocalDateTime.now());
        return ResponseEntity.ok(metrics);
    }

}
