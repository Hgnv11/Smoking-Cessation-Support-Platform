package com.smokingcessation.repository;

import com.smokingcessation.model.User;
import com.smokingcessation.model.UserSmokingProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSmokingProfileRepository extends JpaRepository<UserSmokingProfile, Integer> {
    List<UserSmokingProfile> findByUser(User user);
    Optional<UserSmokingProfile> findByUserAndStatusNot(User user, String status);
    Optional<UserSmokingProfile> findByUserAndStatus(User user, String status);
    List<UserSmokingProfile> findAllByUser(User user);
    List<UserSmokingProfile> findAllByUserAndStatus(User user, String status);

}
