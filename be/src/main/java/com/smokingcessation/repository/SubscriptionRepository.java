package com.smokingcessation.repository;

import com.smokingcessation.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    List<Subscription> findByEndDateBeforeAndPaymentStatus(LocalDate date, String paymentStatus);

}

