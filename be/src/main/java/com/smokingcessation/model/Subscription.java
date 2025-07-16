package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDate;

    @Entity
    @Table(name = "user_subscriptions")
    @Getter
    @Setter
    public class Subscription {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer subscriptionId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        private LocalDate startDate;
        private LocalDate endDate;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private PaymentStatus paymentStatus = PaymentStatus.pending;

        private Integer maxMonthlySlots = 16;

        @CreationTimestamp // <-- chỉ cần thêm dòng này!
        @Column(updatable = false)
        private Timestamp createdAt;

        public enum PaymentStatus {
            pending,
            paid,
            failed,
            refunded
        }
    }

