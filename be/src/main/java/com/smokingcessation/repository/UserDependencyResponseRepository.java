package com.smokingcessation.repository;

import com.smokingcessation.model.UserDependencyResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDependencyResponseRepository extends JpaRepository<UserDependencyResponse, Integer> {
    List<UserDependencyResponse> findByUserUserId(Integer userId);

    Optional<UserDependencyResponse> findByUserUserIdAndQuestionQuestionId(Integer userId, Integer questionId);
}
