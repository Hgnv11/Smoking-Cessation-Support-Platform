package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Integer slotId;

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @Column(name = "slot_number", nullable = false)
    private Integer slotNumber; // 1-4

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "is_booked", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isBooked;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}