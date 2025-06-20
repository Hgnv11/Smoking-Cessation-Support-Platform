package com.smokingcessation.controller;

import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.dto.res.ConsultationSlotDTO;
import com.smokingcessation.model.Consultation;
import com.smokingcessation.model.ConsultationSlot;
import com.smokingcessation.service.ConsultationService;
import com.smokingcessation.service.ConsultationSlotService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;
    private final ConsultationSlotService consultationSlotService;


    @Operation(summary = "User xem đánh giá mentor")
    @GetMapping("/mentor/{mentorId}/ratings-feedback")
    public ResponseEntity<List<ConsultationDTO>> getMentorRatingsAndFeedback(@PathVariable Integer mentorId) {
        List<ConsultationDTO> feedbacks = consultationService.getMentorRatingsAndFeedback(mentorId);
        return ResponseEntity.ok(feedbacks);
    }

    @Operation(summary = "User xem slot trống của mentor theo khoảng ngày")
    @GetMapping("/mentor/{mentorId}/slots")
    public ResponseEntity<List<ConsultationSlotDTO>> getMentorAvailableSlots(
            @PathVariable Integer mentorId) {
        List<ConsultationSlotDTO> slots = consultationSlotService.getAvailableSlotsByMentorAndDateRange(mentorId);
        return ResponseEntity.ok(slots);
    }

    @Operation(summary = " User đặt lịch tư vấn")
    @PostMapping("/book")
    public ResponseEntity<ConsultationDTO> bookConsultation(
            Principal principal,
            @RequestParam Integer mentorId,
            @RequestParam LocalDate slotDate,
            @RequestParam Integer slotNumber) {
        String email = principal.getName();
        ConsultationDTO consultation = consultationService.bookConsultation(email, mentorId, slotDate, slotNumber);
        return ResponseEntity.ok(consultation);
    }

    //
    @Operation(summary = "Mentor xem danh sách tư vấn của mình")
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/mentor")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsForMentor(Principal principal) {
        String mentorEmail = principal.getName();
        List<ConsultationDTO> consultations = consultationService.getConsultationsForMentor(mentorEmail);
        return ResponseEntity.ok(consultations);
    }

    @Operation(summary = "User xem danh sách tư vấn của mình")
    @GetMapping("/user")
    public ResponseEntity<List<ConsultationDTO>> getUserConsultations(Principal principal) {
        String userEmail = principal.getName();
        List<ConsultationDTO> consultations = consultationService.getUserConsultations(userEmail);
        return ResponseEntity.ok(consultations);
    }

    @Operation(summary = "User thêm đánh giá và feedback")
    @PostMapping("/{consultationId}/feedback")
    public ResponseEntity<Void> leaveFeedback(
            Principal principal,
            @PathVariable Integer consultationId,
            @RequestParam Integer rating,
            @RequestParam String feedback) {
        String userEmail = principal.getName();
        consultationService.leaveFeedback(userEmail, consultationId, rating, feedback);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Mentor cập nhật trạng thái và ghi chú")
    @PreAuthorize("hasRole('MENTOR')")
    @PatchMapping("/{consultationId}/status-note")
    public ResponseEntity<ConsultationDTO> updateStatusAndNote(
            Principal principal,
            @PathVariable Integer consultationId,
            @RequestParam Consultation.Status status,
            @RequestParam(required = false) String notes) {
        String mentorEmail = principal.getName();
        ConsultationDTO updatedConsultation = consultationService.updateConsultationStatus(mentorEmail, consultationId, status);
        if (status.equals(Consultation.Status.completed) && notes != null) {
            consultationService.mentorAddNote(mentorEmail, consultationId, notes);
        }
        return ResponseEntity.ok(updatedConsultation);
    }
}