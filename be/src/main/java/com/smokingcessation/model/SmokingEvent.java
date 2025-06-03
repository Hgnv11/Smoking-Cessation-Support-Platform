package com.smokingcessation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "smoking_events")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmokingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer eventId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime eventTime = LocalDateTime.now();

    private Integer cigarettesSmoked = 1;

    @Min(value = 0, message = "Craving level must be between 0 and 10")
    @Max(value = 10, message = "Craving level must be between 0 and 10")
    private Integer cravingLevel;

    @Enumerated(EnumType.STRING)
    private Mood mood;

    private String notes;

    public enum Mood {
        excellent, good, neutral, bad, terrible
    }

}
