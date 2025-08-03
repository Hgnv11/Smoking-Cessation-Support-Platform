package com.smokingcessation.repository;

import com.smokingcessation.model.Trigger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TriggerRepository extends JpaRepository<Trigger, Integer> {
    List<Trigger> findByCategoryCategoryId(Integer categoryId);
}
