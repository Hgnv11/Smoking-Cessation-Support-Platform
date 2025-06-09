package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_reasons")
@Data
public class UserReasons {
    @EmbeddedId
    private UserReasonsId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("reasonId")
    @JoinColumn(name = "reason_id")
    private ReasonsQuit reason;

    @Embeddable
    @Data
    public static class UserReasonsId {
        @Column(name = "user_id")
        private Integer userId;

        @Column(name = "reason_id")
        private Integer reasonId;
    }
}