package com.smokingcessation.controller;

import com.smokingcessation.dto.res.PlanResultStatsDTO;
import com.smokingcessation.dto.res.UserGrowthDTO;
import com.smokingcessation.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/user-growth/7-days")
    public List<UserGrowthDTO> getUserGrowth7Days() {
        return dashboardService.getUserGrowth7DayCompare();
    }

    @GetMapping("/user-growth/30-days")
    public List<UserGrowthDTO> getUserGrowth30Days() {
        return dashboardService.getUserGrowth30DayCompare();
    }

    @GetMapping("/plan-stats")
    public Map<String, PlanResultStatsDTO> getPlanStats() {
        return dashboardService.getPlanResultStats();
    }

}
