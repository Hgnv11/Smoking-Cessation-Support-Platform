
package com.smokingcessation.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String phone;

    private String profileName;

    @Column(nullable = false)
    private String passwordHash;

    private String fullName;

    private String avatarUrl;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Role role = Role.guest;

    private Boolean hasActive = false;
    private Boolean isDelete=false;
    private String typeLogin;

    private Boolean isVerified = false;


    private boolean isBlock = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt = LocalDateTime.now();

    private LocalDateTime lastLogin;

    public enum Gender {
        male, female, other
    }

    public enum Role {
        guest, user, mentor, admin
    }
}