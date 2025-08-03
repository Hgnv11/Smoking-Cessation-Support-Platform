package com.smokingcessation.repository;

import com.smokingcessation.model.DependencyAnswer;
import com.smokingcessation.model.DependencyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DependencyAnswerRepository extends JpaRepository<DependencyAnswer, Integer> {
    List<DependencyAnswer> findByQuestion(DependencyQuestion question);
}
