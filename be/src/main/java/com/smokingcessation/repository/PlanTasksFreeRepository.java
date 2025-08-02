package com.smokingcessation.repository;


import com.smokingcessation.model.PlanTasksFree;
import com.smokingcessation.model.PlanTasksPro;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PlanTasksFreeRepository extends JpaRepository<PlanTasksFree, Long> {
    List<PlanTasksFree> findByUser_UserId(Integer userId);
    boolean existsByUserAndTaskDay(User user, LocalDate taskDay);
    List<PlanTasksFree> findByUserAndTaskDay(User user, LocalDate taskDay);

}
