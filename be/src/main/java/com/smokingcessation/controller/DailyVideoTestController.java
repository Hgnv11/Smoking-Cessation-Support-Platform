package com.smokingcessation.controller;

import com.smokingcessation.service.DailyVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-daily")
@RequiredArgsConstructor
public class DailyVideoTestController {

    private final DailyVideoService dailyVideoService;

    @PostMapping("/create-room")
    public String createRoom() {
        return dailyVideoService.createRoom();
    }

    @DeleteMapping("/delete-room")
    public String deleteRoom(@RequestParam String fullUrl) {
        dailyVideoService.deleteRoomByUrl(fullUrl);
        return "Deleted room with URL: " + fullUrl;
    }
}
