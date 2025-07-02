package com.smokingcessation.repository;

import com.smokingcessation.model.Strategy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StrategyRepository extends JpaRepository<Strategy, Integer> {
    List<Strategy> findByCategoryCategoryId(Integer categoryId);
}