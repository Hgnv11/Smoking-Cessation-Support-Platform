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
        // Lấy các sự kiện hút thuốc trong 8 giờ qua (đủ để bao quát COHb)

        LocalDateTime startTime = currentTime.minusHours(8);
        List<SmokingEvent> events = smokingEventRepository.findByUser_UserIdAndEventTimeAfter(userId, startTime);

        // Chỉ số cơ bản
        double bpSystolic = 120.0; // mmHg
        double bpDiastolic = 80.0; // mmHg
        double heartRate = 70.0; // nhịp/phút
        double spo2 = 98.0; // %
        double cohb = 0.5; // %

        // Thời gian phục hồi cơ bản (phút)
        double baseRecoveryTimeBPandHR = 30.0; // Huyết áp và nhịp tim
        double baseRecoveryTimeSpO2 = 60.0; // SpO2
        double baseHalfLifeCOHb = 240.0; // COHb (4 giờ)

        // Tính toán trạng thái sức khỏe, xem xét từng sự kiện
        for (SmokingEvent event : events) {
            long timeDiffMinutes = Duration.between(event.getEventTime(), currentTime).toMinutes();
            int cigarettes = event.getCigarettesSmoked();

            // Thời gian phục hồi cho sự kiện này
            double recoveryTimeBPandHR = Math.min(baseRecoveryTimeBPandHR + (cigarettes * 5.0), 60.0);
            double recoveryTimeSpO2 = Math.min(baseRecoveryTimeSpO2 + (cigarettes * 10.0), 120.0);
            double halfLifeCOHb = Math.min(baseHalfLifeCOHb * (1 + 0.1 * cigarettes), 480.0);

            // Huyết áp và nhịp tim
            if (timeDiffMinutes <= recoveryTimeBPandHR) {
                double decayFactor = 1.0 - (timeDiffMinutes / recoveryTimeBPandHR); // Giảm tuyến tính
                bpSystolic = Math.min(bpSystolic + (7 * cigarettes * decayFactor), 160);
                bpDiastolic = Math.min(bpDiastolic + (5 * cigarettes * decayFactor), 100);
                heartRate = Math.min(heartRate + (15 * cigarettes * decayFactor), 120);
            } else {
                bpSystolic = Math.min(bpSystolic, 120.0);
                bpDiastolic = Math.min(bpDiastolic, 80.0);
                heartRate = Math.min(heartRate, 70.0);
            }

            // SpO2
            if (timeDiffMinutes <= recoveryTimeSpO2) {
                double decayFactor = 1.0 - (timeDiffMinutes / recoveryTimeSpO2); // Giảm tuyến tính
                spo2 = Math.max(spo2 - (1 * cigarettes * decayFactor), 90);
            } else {
                spo2 = Math.max(spo2, 98.0);
            }

            // COHb
            if (timeDiffMinutes <= (halfLifeCOHb * 2)) {
                double decayFactor = Math.pow(0.5, timeDiffMinutes / halfLifeCOHb); // Giảm theo hàm mũ
                cohb = Math.min(cohb + (0.75 * cigarettes * decayFactor), 10);
            } else {
                cohb = Math.min(cohb, 0.5);
            }
        }

        // Phục hồi hoàn toàn nếu không có sự kiện
        if (events.isEmpty()) {
            bpSystolic = 120.0;
            bpDiastolic = 80.0;
            heartRate = 70.0;
            spo2 = 98.0;
            cohb = 0.5;
        }

        // Trả về chỉ số sức khỏe
        return new HealthMetrics(bpSystolic, bpDiastolic, heartRate, spo2, cohb);
    }
}
