package com.smokingcessation.repository;

import com.smokingcessation.model.User;
import com.smokingcessation.model.UserReasons;
import com.smokingcessation.model.UserReasons.UserReasonsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReasonsRepository extends JpaRepository<UserReasons, UserReasonsId> {
    boolean existsByUserUserIdAndReasonReasonId(Integer userId, Integer reasonId);
    @Query("SELECT ur FROM UserReasons ur WHERE ur.user = :user AND ur.reason.isActive = true")
    List<UserReasons> findByUser(User user);
}