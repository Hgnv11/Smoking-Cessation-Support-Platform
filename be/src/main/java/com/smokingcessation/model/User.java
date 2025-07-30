
package com.smokingcessation.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(unique = true, nullable = false)
    private String email;

    private String profileName;

    @Column(nullable = false)
    @JsonProperty(access = Access.WRITE_ONLY)
    private String passwordHash;

    private String fullName;

    private String avatarUrl;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Role role = Role.guest;

    private String note;

    private Boolean hasActive = false;
    private Boolean isDelete=false;
    private String typeLogin;

    private Boolean isVerified = false;


    private Boolean isBlock = false;

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