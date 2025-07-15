package com.smokingcessation.scheduler;

import com.smokingcessation.model.Subscription;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.SubscriptionRepository;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SubscriptionExpiryChecker {

    private final SubscriptionRepository subscriptionRepo;
    private final UserRepository userRepo;

    // Chạy mỗi ngày lúc 2:00 sáng
    @Scheduled(cron = "0 0 2 * * *")
    public void checkExpiredSubscriptions() {
        LocalDate today = LocalDate.now();
        List<Subscription> expiredSubs = subscriptionRepo.findByEndDateBeforeAndPaymentStatus(today, "paid");

        for (Subscription sub : expiredSubs) {
            User user = sub.getUser();
            if (user.getHasActive()) {
                user.setHasActive(false);
                userRepo.save(user);
            }
        }
    }
}
