package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

    @Entity
    @Table(name = "payments")
    @Getter
    @Setter
    @NoArgsConstructor
    public class Payment {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer paymentId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "subscription_id", nullable = false)
        private Subscription subscription;

        @Column(nullable = false)
        private Double amount;

        @Column(nullable = false)
        private String paymentMethod; // "vnpay"

        @Column(nullable = false, unique = true, length = 64)
        private String transactionId; // VNPay's transaction id

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private PaymentStatus status = PaymentStatus.pending;

        @Column
        private Timestamp paymentDate;

        public enum PaymentStatus {
            pending,
            completed,
            failed,
            refunded
        }
    }

