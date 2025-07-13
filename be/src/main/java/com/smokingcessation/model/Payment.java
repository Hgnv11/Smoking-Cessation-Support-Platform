package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;

    private Double amount;

    private String paymentMethod; // ví dụ: "vnpay"

    private String transactionId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.pending;

    private Timestamp paymentDate = new Timestamp(System.currentTimeMillis());

    public enum PaymentStatus {
        pending,
        completed,
        failed,
        refunded
    }
}
