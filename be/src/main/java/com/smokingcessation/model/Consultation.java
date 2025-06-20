package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultation_id")
    private Integer consultationId;

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private ConsultationSlot slot;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @Column(name = "status", columnDefinition = "ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled'")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "notes")
    private String notes;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "feedback")
    private String feedback;

    @Column(name = "meeting_link")
    private String meetingLink;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
    public enum Status {
        scheduled,
        completed,
        cancelled
    }
}


