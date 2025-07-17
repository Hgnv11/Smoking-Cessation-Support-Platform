package com.smokingcessation.repository;

import com.smokingcessation.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByTransactionId(String transactionId);
    @Query("SELECT SUM(p.amount) FROM Payment p " +
            "WHERE p.status = 'completed' AND p.paymentDate >= :startDate AND p.paymentDate < :endDate")
    Double sumRevenueByDateRange(@Param("startDate") LocalDateTime start, @Param("endDate") LocalDateTime end);
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'completed'")
    long sumCompletedPayments();


}