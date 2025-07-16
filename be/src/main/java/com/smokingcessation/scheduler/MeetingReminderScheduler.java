package com.smokingcessation.scheduler;

import com.smokingcessation.service.NotificationUserService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MeetingReminderScheduler {

//    private final BookingRepository bookingRepository; anh hoànng Viết booking r thì thêm vô nha !!!
    private final NotificationUserService notificationService;

    public MeetingReminderScheduler( NotificationUserService notificationService) {
//        this.bookingRepository = repo;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0 8 * * *") // Mỗi ngày lúc 8h sáng
    public void remindMeetings() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneDayLater = now.plusDays(1);
//        List<Booking> bookings = bookingRepository.findAllByMeetingTimeBetween(oneDayLater.minusMinutes(1), oneDayLater.plusMinutes(1));
//        for (Booking b : bookings) {
//            notificationService.notifyPrepareForMeeting(b.getUserId(), b.getMeetingTime());
//        }
    }
}
