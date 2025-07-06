package com.smokingcessation.repository;

import com.smokingcessation.model.UserStrategy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserStrategyRepository extends JpaRepository<UserStrategy, Integer> {
    List<UserStrategy> findByUserUserId(Integer userId);
    boolean existsByUserUserIdAndStrategyStrategyId(Integer userId, Integer strategyId);
    void deleteByUserUserIdAndStrategyStrategyId(Integer userId, Integer strategyId);
    void deleteAllByUser_UserId(Integer userId);
}