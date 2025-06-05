package com.smokingcessation.repository;

import com.smokingcessation.model.User;
import com.smokingcessation.model.UserSmokingProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSmokingProfileRepository extends JpaRepository<UserSmokingProfile, Integer> {
    Optional<UserSmokingProfile> findByUser(User user);
}
