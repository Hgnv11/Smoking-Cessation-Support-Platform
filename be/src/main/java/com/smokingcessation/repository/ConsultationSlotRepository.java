package com.smokingcessation.repository;

import com.smokingcessation.model.ConsultationSlot;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ConsultationSlotRepository extends JpaRepository<ConsultationSlot, Integer> {
    List<ConsultationSlot> findByMentor(User mentor);
    List<ConsultationSlot> findByMentorAndSlotDateBetweenAndIsBookedFalse(User mentor, LocalDate startDate, LocalDate endDate);
    boolean existsByMentorAndSlotNumberAndSlotDate(User mentor, Integer slotNumber, LocalDate slotDate);
    boolean existsByMentorAndSlotNumberAndSlotDateAndSlotIdNot(User mentor, Integer slotNumber, LocalDate slotDate, Integer slotId);
    Optional<ConsultationSlot> findByMentorAndSlotNumberAndSlotDate(User mentor, Integer slotNumber, LocalDate slotDate);
    List<ConsultationSlot> findByMentorAndSlotDate(User mentor, LocalDate today);
}