package com.smokingcessation.controller;

import com.smokingcessation.service.DailyVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-daily")
@RequiredArgsConstructor
public class DailyVideoTestController {

    private final DailyVideoService dailyVideoService;

    @PostMapping("/create-room/{consultationId}")
    public ResponseEntity<String> createRoom(@PathVariable Integer consultationId) {
        String newRoomUrl = dailyVideoService.createAndAssignVideoRoom(consultationId);
        return ResponseEntity.ok(newRoomUrl);
    }

    @DeleteMapping("/delete-room")
    public String deleteRoom(@RequestParam String fullUrl) {
        dailyVideoService.deleteRoomByUrl(fullUrl);
        return "Deleted room with URL: " + fullUrl;
    }
}
