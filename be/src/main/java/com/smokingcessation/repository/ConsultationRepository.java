package com.smokingcessation.repository;

import com.smokingcessation.model.Consultation;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {
    List<Consultation> findByUser(User user);
    List<Consultation> findByMentor(User mentor);
}