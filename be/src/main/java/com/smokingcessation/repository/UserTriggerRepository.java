package com.smokingcessation.repository;

import com.smokingcessation.model.UserTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTriggerRepository extends JpaRepository<UserTrigger, Integer> {
    List<UserTrigger> findByUserUserId(Integer userId);
    boolean existsByUserUserIdAndTriggerTriggerId(Integer userId, Integer triggerId);
    void deleteByUserUserIdAndTriggerTriggerId(Integer userId, Integer triggerId);
    void deleteAllByUser_UserId(Integer userId);
}