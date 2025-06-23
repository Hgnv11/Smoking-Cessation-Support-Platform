package com.smokingcessation.repository;

import com.smokingcessation.model.ReasonsQuit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReasonsQuitRepository extends JpaRepository<ReasonsQuit, Integer> {
    ReasonsQuit findByReasonText(String reasonText);
    List<ReasonsQuit> findAllByIsActiveTrue();
}