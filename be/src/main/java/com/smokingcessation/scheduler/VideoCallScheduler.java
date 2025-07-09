package com.smokingcessation.scheduler;

import com.smokingcessation.model.Consultation;
import com.smokingcessation.model.ConsultationSlot;
import com.smokingcessation.repository.ConsultationRepository;
import com.smokingcessation.service.DailyVideoService;
import com.smokingcessation.util.SlotUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@ConditionalOnProperty(
        name = "scheduler.video.enabled",
        havingValue = "true",
        matchIfMissing = false
)
@RequiredArgsConstructor
@Slf4j
public class VideoCallScheduler {

    private final ConsultationRepository consultationRepository;
    private final DailyVideoService dailyVideoService;

    // Chạy mỗi phút
    @Scheduled(cron = "0 * * * * *") // Every minute
    public void handleVideoCalls() {
        List<Consultation> consultations = consultationRepository.findAll();

        LocalDateTime now = LocalDateTime.now();

        for (Consultation consultation : consultations) {
            ConsultationSlot slot = consultation.getSlot();
            if (slot == null || !Boolean.TRUE.equals(slot.getIsBooked())) continue;

            LocalDateTime startTime = SlotUtils.getSlotStartTime(slot.getSlotNumber(), slot.getSlotDate());
            LocalDateTime endTime = SlotUtils.getSlotEndTime(slot.getSlotNumber(), slot.getSlotDate());

            // Tạo trước 15 phút nếu chưa có link
            if (consultation.getMeetingLink() == null &&
                    now.isAfter(startTime.minusMinutes(15)) &&
                    now.isBefore(startTime)) {

                String meetingUrl = dailyVideoService.createRoom();
                consultation.setMeetingLink(meetingUrl);
                consultationRepository.save(consultation);
                log.info("Created Daily.co meeting for consultation ID {}", consultation.getConsultationId());
            }

            // Xóa link sau 15 phút kể từ khi kết thúc
            if (consultation.getMeetingLink() != null &&
                    now.isAfter(endTime.plusMinutes(15))) {

                dailyVideoService.deleteRoomByUrl(consultation.getMeetingLink());
                consultationRepository.save(consultation);
                log.info("Deleted Daily.co meeting for consultation ID {}", consultation.getConsultationId());
            }
        }
    }
}
