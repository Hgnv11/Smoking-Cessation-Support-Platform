package com.smokingcessation.repository;

import com.smokingcessation.model.User;
import com.smokingcessation.model.UserDependencyScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDependencyScoreRepository extends JpaRepository<UserDependencyScore, Integer> {
    Optional<UserDependencyScore> findByUserUserId(Integer userId);
    Optional<UserDependencyScore> findTopByUserOrderByCreatedAtDesc(User user);
}
