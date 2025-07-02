package com.smokingcessation.repository;

import com.smokingcessation.model.StrategyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StrategyCategoryRepository extends JpaRepository<StrategyCategory, Integer> {
}