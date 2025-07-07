package com.smokingcessation.service;

import com.smokingcessation.dto.res.ConsultationSlotDTO;
import com.smokingcessation.mapper.ConsultationSlotMapper;
import com.smokingcessation.model.ConsultationSlot;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.ConsultationSlotRepository;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationSlotService {

    private final ConsultationSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final ConsultationSlotMapper slotMapper;

    public ConsultationSlotDTO createSlot(String mentorEmail, Integer slotNumber, LocalDate slotDate) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }
        if (slotNumber < 1 || slotNumber > 4) {
            throw new RuntimeException("Slot number must be between 1 and 4");
        }
        if (slotDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot create slots for past dates");
        }

        if (slotRepository.existsByMentorAndSlotNumberAndSlotDate(mentor, slotNumber, slotDate)) {
            throw new RuntimeException("Slot already exists for this mentor, slot number, and date");
        }

        ConsultationSlot slot = ConsultationSlot.builder()
                .mentor(mentor)
                .slotNumber(slotNumber)
                .slotDate(slotDate)
                .isBooked(false)
                .createdAt(LocalDateTime.now())
                .build();
        return slotMapper.toDto(slotRepository.save(slot));
    }

    public List<ConsultationSlotDTO> createMultipleSlots(String mentorEmail, List<Integer> slotNumbers, List<LocalDate> dates) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }

        List<ConsultationSlot> slots = new ArrayList<>();
        for (LocalDate date : dates) {
            if (date.isBefore(LocalDate.now())) {
                continue;
            }
            for (Integer slotNumber : slotNumbers) {
                if (slotNumber < 1 || slotNumber > 4) {
                    throw new RuntimeException("Slot number must be between 1 and 4");
                }
                if (slotRepository.existsByMentorAndSlotNumberAndSlotDate(mentor, slotNumber, date)) {
                    continue;
                }

                ConsultationSlot slot = ConsultationSlot.builder()
                        .mentor(mentor)
                        .slotNumber(slotNumber)
                        .slotDate(date)
                        .isBooked(false)
                        .createdAt(LocalDateTime.now())
                        .build();
                slots.add(slot);
            }
        }
        return slotRepository.saveAll(slots).stream()
                .map(slotMapper::toDto)
                .collect(Collectors.toList());
    }

    public ConsultationSlotDTO updateSlot(Integer slotId, Integer slotNumber, LocalDate slotDate, String mentorEmail) {
        ConsultationSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        User mentor = mentorEmail != null ? userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found")) : slot.getMentor();
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }
        if (slotNumber != null && (slotNumber < 1 || slotNumber > 4)) {
            throw new RuntimeException("Slot number must be between 1 and 4");
        }
        if (slotDate != null && slotDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot update slot to a past date");
        }

        if (slotNumber != null && slotDate != null && slotRepository.existsByMentorAndSlotNumberAndSlotDateAndSlotIdNot(mentor, slotNumber, slotDate, slotId)) {
            throw new RuntimeException("Another slot already exists for this mentor, slot number, and date");
        }

        if (slotNumber != null) slot.setSlotNumber(slotNumber);
        if (slotDate != null) slot.setSlotDate(slotDate);
        if (mentorEmail != null) slot.setMentor(mentor);
        return slotMapper.toDto(slotRepository.save(slot));
    }

    public void deleteSlot(Integer slotId) {
        ConsultationSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        if (slot.getIsBooked()) {
            throw new RuntimeException("Cannot delete a booked slot");
        }
        slotRepository.deleteById(slotId);
    }

    public List<ConsultationSlotDTO> getAvailableSlotsByMentorAndDateRange(Integer mentorId) {
        User mentor = userRepository.findByUserId(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }
        LocalDate startDate = LocalDate.now().plusDays(1);
        LocalDate endDate = LocalDate.now().plusDays(30);

        return slotRepository.findByMentorAndSlotDateBetweenAndIsBookedFalse(mentor, startDate, endDate)
                .stream()
                .map(slotMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ConsultationSlotDTO> getSlotsByMentorId(Integer mentorId) {
        User mentor = userRepository.findByUserId(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }
        return slotRepository.findByMentor(mentor).stream()
                .map(slotMapper::toDto)
                .collect(Collectors.toList());
    }

    public User getMentorByEmail(String email) {
        User mentor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }
        return mentor;
    }

}
