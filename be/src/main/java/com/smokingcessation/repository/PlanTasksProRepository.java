package com.smokingcessation.repository;

import com.smokingcessation.model.PlanTasksPro;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlanTasksProRepository extends JpaRepository<PlanTasksPro, Integer> {
    List<PlanTasksPro> findByUser(User user);
    List<PlanTasksPro> findByMentorAndUser(User mentor, User user);
    boolean existsByUserAndTaskDay(User user, LocalDate taskDay);

}