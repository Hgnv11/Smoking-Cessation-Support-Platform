package com.smokingcessation.service;

import com.smokingcessation.dto.res.HealthMetrics;
import com.smokingcessation.model.SmokingEvent;
import com.smokingcessation.repository.SmokingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;

@Service
public class HealthMetricsService {

    @Autowired
    private SmokingEventRepository smokingEventRepository;

    public HealthMetrics calculateHealthMetrics(Integer userId, LocalDateTime currentTime) {
        LocalDateTime startTime = currentTime.minusHours(8);
        List<SmokingEvent> events = smokingEventRepository.findByUser_UserIdAndEventTimeAfter(userId, startTime);

        // Giá trị cơ bản
        double bpSystolic = 120.0;
        double bpDiastolic = 80.0;
        double heartRate = 70.0;
        double spo2 = 98.0;
        double cohb = 0.5;

        // Thời điểm đạt đỉnh
        double peakTimeBP_HR = 15.0;     // phút (BP và HR đạt đỉnh sau 15 phút)
        double endTimeBP_HR = 60.0;      // phục hồi hoàn toàn sau 60 phút

        double peakTimeSpO2 = 25.0;      // SpO2 giảm mạnh nhất sau 25 phút
        double endTimeSpO2 = 120.0;      // phục hồi hoàn toàn sau 120 phút

        double baseHalfLifeCOHb = 240.0; // COHb giảm theo half-life 4 giờ

        for (SmokingEvent event : events) {
            long timeDiff = Duration.between(event.getEventTime(), currentTime).toMinutes();
            int cigs = event.getCigarettesSmoked();

            // --- Huyết áp & nhịp tim ---
            double factorBP = 0.0;
            if (timeDiff <= endTimeBP_HR) {
                if (timeDiff <= peakTimeBP_HR) {
                    factorBP = timeDiff / peakTimeBP_HR; // tăng dần
                } else {
                    factorBP = 1 - ((timeDiff - peakTimeBP_HR) / (endTimeBP_HR - peakTimeBP_HR)); // giảm dần
                }
            }

            bpSystolic += 7 * cigs * factorBP;
            bpDiastolic += 5 * cigs * factorBP;
            heartRate += 15 * cigs * factorBP;

            // --- SpO2 ---
            double factorSpO2 = 0.0;
            if (timeDiff <= endTimeSpO2) {
                if (timeDiff <= peakTimeSpO2) {
                    factorSpO2 = timeDiff / peakTimeSpO2; // giảm dần
                } else {
                    factorSpO2 = 1 - ((timeDiff - peakTimeSpO2) / (endTimeSpO2 - peakTimeSpO2)); // phục hồi
                }
            }
            spo2 -= 1.0 * cigs * factorSpO2;

            // --- COHb ---
            if (timeDiff <= baseHalfLifeCOHb * 2) {
                double decayFactor = Math.pow(0.5, timeDiff / baseHalfLifeCOHb);
                cohb += 0.75 * cigs * decayFactor;
            }
        }

        // Giới hạn trong khoảng hợp lý
        bpSystolic = Math.min(bpSystolic, 160);
        bpDiastolic = Math.min(bpDiastolic, 100);
        heartRate = Math.min(heartRate, 120);
        spo2 = Math.max(spo2, 90);
        cohb = Math.min(cohb, 10);

        return new HealthMetrics(bpSystolic, bpDiastolic, heartRate, spo2, cohb);
    }

}
