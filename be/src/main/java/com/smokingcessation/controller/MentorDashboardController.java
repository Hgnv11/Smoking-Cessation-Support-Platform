package com.smokingcessation.controller;

import com.smokingcessation.dto.dashboard.*;
import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.dto.res.SmokingProgressDTO;
import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.service.ConsultationService;
import com.smokingcessation.service.SmokingEventService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/mentor-dashboard")
@RequiredArgsConstructor
public class MentorDashboardController {

    private final ConsultationService consultationService;
    private final SmokingEventService smokingEventService;

    @Operation(summary = "Tổng quan dashboard của mentor")
    @GetMapping("/overview")
    public ResponseEntity<MentorDashboardDTO> getOverview(Principal principal) {
        String mentorEmail = principal.getName();
        MentorDashboardDTO dto = consultationService.getMentorDashboardOverview(mentorEmail);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Mentor xem lịch tư vấn hôm nay của mình")
    @GetMapping("/mentor/today")
    public ResponseEntity<List<SlotSummaryDTO>> getTodaySlotsForMentor(Principal principal) {
        String mentorEmail = principal.getName();
        List<SlotSummaryDTO> slots = consultationService.getTodayConsultationsForMentor(mentorEmail);
        return ResponseEntity.ok(slots);
    }


    @Operation(summary = "Mentor đánh dấu lịch hoàn thành")
    @PostMapping("/consultations/{consultationId}/complete")
    public ResponseEntity<Void> markCompleted(@PathVariable Integer consultationId, Principal principal) {
        consultationService.completeConsultation(consultationId, principal.getName());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Mentor thêm ghi chú")
    @PostMapping("/consultations/{consultationId}/add-note")
    public ResponseEntity<Void> addNote(@PathVariable Integer consultationId,
                                        @RequestParam String notes,
                                        Principal principal) {
        consultationService.mentorAddNote(principal.getName(), consultationId, notes);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Mentor xem tất cả lịch tư vấn với một user")
    @GetMapping("/mentor/user/{userId}/consultations")
    public ResponseEntity<List<SlotSummaryDTO>> getConsultationsWithUser(
            @PathVariable Integer userId,
            Principal principal) {

        String mentorEmail = principal.getName();
        List<SlotSummaryDTO> consultations = consultationService
                .getConsultationSummariesWithUser(mentorEmail, userId);

        return ResponseEntity.ok(consultations);
    }


    @Operation(summary = "Chi tiết các kết hoạch cai thuốc của user")
    @GetMapping("/smoking-progress/user/{UserId}")
    public ResponseEntity<List<SmokingProgressDTO>> getProgressByEmail(@PathVariable Integer UserId) {
        List<SmokingProgressDTO> progressList = smokingEventService.getAllSmokingProgressByUser(UserId);
        return ResponseEntity.ok(progressList);
    }

    @Operation(summary = "Mentor xem danh sách user đặt lịch với mình")
    @GetMapping("/consultations/users")
    public ResponseEntity<List<UserDTO>> getUsersBookedWithMentor(Principal principal) {
        String mentorEmail = principal.getName();
        List<UserDTO> users = consultationService.getUsersConsultedWithMentor(mentorEmail);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Mentor xem chi tiết lịch tư vấn với user")
    @GetMapping("/consultations/{consultationId}")
    public ResponseEntity<ConsultationDTO> getConsultationDetailWithUser(
            @PathVariable Integer consultationId,
            Principal principal) {

        String mentorEmail = principal.getName();
        ConsultationDTO consultation = consultationService
                .getConsultationDetailWithUser(mentorEmail, consultationId);

        return ResponseEntity.ok(consultation);
    }

    @Operation(summary = "Thống kê Client Management cho mentor")
    @GetMapping("/mentor/client-management")
    public ResponseEntity<ClientManagementDTO> getClientManagementStats(Principal principal) {
        String mentorEmail = principal.getName();
        ClientManagementDTO dto = consultationService.getClientManagementStats(mentorEmail);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Mentor xem báo cáo tổng quan về các user có lịch tư vấn với mình")
    @GetMapping("/reports/user-progress")
    public List<ClientProgressDTO> getClientProgress(@RequestParam String mentorEmail) {
        return consultationService.getClientProgress(mentorEmail);
    }

    @Operation(summary = "Mentor xem báo cáo nhanh: tổng buổi + tỉ lệ thành công + tỉ lệ quay lại + tỉ lệ hoàn thành")
    @GetMapping("/reports/summary")
    public ResponseEntity<MentorReportDTO> getMentorSummary(@RequestParam String mentorEmail) {
        MentorReportDTO dto = consultationService.getMentorReport(mentorEmail);
        return ResponseEntity.ok(dto);
    }


}
