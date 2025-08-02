package com.smokingcessation.repository;

import com.smokingcessation.model.UserDependencyResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDependencyResponseRepository extends JpaRepository<UserDependencyResponse, Integer> {
    List<UserDependencyResponse> findByUser_UserId(Integer userId);

    Optional<UserDependencyResponse> findByUser_UserIdAndQuestion_QuestionId(Integer userId, Integer questionId);

    void deleteByUser_UserId(Integer userId);

}
