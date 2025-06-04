// repository/UserRepository.java
package com.smokingcessation.repository;

import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByProfileName(String profileName);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<User> findByUserId(int userId);
}