package com.smokingcessation.controller;

import com.smokingcessation.dto.res.SmokingEventDTO;
import com.smokingcessation.service.SmokingEventService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/smoking-events")
@RequiredArgsConstructor
public class SmokingEventController {

    private final SmokingEventService smokingEventService;

    // Xem danh sách sự kiện hút thuốc của chính mình
    @Operation(
            summary = "Xem danh sách sự kiện hút thuốc của chính mình"
    )
    @GetMapping("/my")
    public ResponseEntity<List<SmokingEventDTO>> getMySmokingEvents(Principal principal) {
        String email = principal.getName();
        List<SmokingEventDTO> events = smokingEventService.getMySmokingEvents(email);
        return ResponseEntity.ok(events);
    }

    // Thêm sự kiện hút thuốc mới
    @Operation(
            summary = "Thêm sự kiện hút thuốc mới"
    )
    @PostMapping
    public ResponseEntity<SmokingEventDTO> addNewSmokingEvent(
            Principal principal,
            @RequestBody SmokingEventDTO request) {
        String email = principal.getName();
        SmokingEventDTO createdEvent = smokingEventService.addNewSmokingEvent(email, request);
        return ResponseEntity.ok(createdEvent);
    }

    // Cập nhật sự kiện hút thuốc
    @Operation(
            summary = "Cập nhật sự kiện hút thuốc"
    )
    @PutMapping("/{eventId}")
    public ResponseEntity<SmokingEventDTO> updateSmokingEvent(
            @PathVariable int eventId,
            Principal principal,
            @RequestBody SmokingEventDTO request) {
        String email = principal.getName();
        SmokingEventDTO updatedEvent = smokingEventService.updateSmokingEvent(eventId, email, request);
        return ResponseEntity.ok(updatedEvent);
    }

    // Xóa sự kiện hút thuốc
    @Operation(
            summary = "Xóa sự kiện hút thuốc"
    )
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteSmokingEvent(
            @PathVariable int eventId,
            Principal principal) {
        String email = principal.getName();
        smokingEventService.deleteSmokingEvent(eventId, email);
        return ResponseEntity.ok().body("Smoking event deleted successfully");
    }



}