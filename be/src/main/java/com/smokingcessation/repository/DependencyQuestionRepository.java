package com.smokingcessation.repository;

import com.smokingcessation.model.DependencyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DependencyQuestionRepository extends JpaRepository<DependencyQuestion, Integer> {
}