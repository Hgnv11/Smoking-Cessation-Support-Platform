package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_triggers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTrigger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_trigger_id")
    private Integer userTriggerId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "trigger_id", nullable = false)
    private Trigger trigger;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}