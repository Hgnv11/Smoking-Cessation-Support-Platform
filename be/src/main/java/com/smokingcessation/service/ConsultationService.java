package com.smokingcessation.service;

import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.mapper.ConsultationMapper;
import com.smokingcessation.mapper.UserMapper;
import com.smokingcessation.model.Consultation;
import com.smokingcessation.model.ConsultationSlot;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.ConsultationRepository;
import com.smokingcessation.repository.ConsultationSlotRepository;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final ConsultationSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ConsultationMapper consultationMapper;

    public ConsultationDTO bookConsultation(String userEmail, Integer mentorId, LocalDate slotDate, Integer slotNumber) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!Boolean.TRUE.equals(user.getHasActive())) {
            throw new RuntimeException("User account is inactive");
        }
        if (!"user".equals(user.getRole().name())) {
            throw new RuntimeException("Only users can book consultations");
        }

        User mentor = userRepository.findByUserId(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }

        if (slotNumber < 1 || slotNumber > 4) {
            throw new RuntimeException("Slot number must be between 1 and 4");
        }
        if (slotDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot book a slot for a past date");
        }

        ConsultationSlot slot = slotRepository.findByMentorAndSlotNumberAndSlotDate(mentor, slotNumber, slotDate)
                .orElseThrow(() -> new RuntimeException("Slot not found for the given mentor, date, and slot number"));
        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            throw new RuntimeException("Slot is already booked");
        }

        boolean isSlotClashing = consultationRepository
                .findByUser(user).stream()
                .anyMatch(c ->
                        c.getSlot().getSlotDate().equals(slotDate)
                                && c.getSlot().getSlotNumber().equals(slotNumber)
                                && !c.getStatus().equals(Consultation.Status.cancelled)
                );

        if (isSlotClashing) {
            throw new RuntimeException("You already have a consultation booked for this time slot.");
        }

        Consultation consultation = Consultation.builder()
                .slot(slot)
                .user(user)
                .mentor(mentor)
                .status(Consultation.Status.scheduled)
                .createdAt(LocalDateTime.now())
                .build();

        slot.setIsBooked(true);
        slotRepository.save(slot);
        return consultationMapper.toDto(consultationRepository.save(consultation));
    }

    public List<ConsultationDTO> getUserConsultations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!Boolean.TRUE.equals(user.getHasActive())) {
            throw new RuntimeException("User account is inactive");
        }
        return consultationRepository.findByUser(user).stream()
                .map(consultationMapper::toDto)
                .toList();
    }

    public void leaveFeedback(String userEmail, Integer consultationId, Integer rating, String feedback) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!Boolean.TRUE.equals(user.getHasActive())) {
            throw new RuntimeException("User account is inactive");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        if (!consultation.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to leave feedback");
        }
        if (!consultation.getStatus().equals(Consultation.Status.completed)) {
            throw new RuntimeException("Can only leave feedback for completed consultations");
        }
        if (rating < 0 || rating > 5) {
            throw new RuntimeException("Rating must be between 0 and 5");
        }

        consultation.setRating(rating);
        consultation.setFeedback(feedback);
        consultationRepository.save(consultation);
    }

    public void mentorAddNote(String mentorEmail, Integer consultationId, String notes) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Only mentors can add notes");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        if (!consultation.getMentor().getUserId().equals(mentor.getUserId())) {
            throw new RuntimeException("Unauthorized to add notes");
        }
        if (!consultation.getStatus().equals(Consultation.Status.completed)) {
            throw new RuntimeException("Can only add notes for completed consultations");
        }

        consultation.setNotes(notes);
        consultationRepository.save(consultation);
    }

    public List<ConsultationDTO> getMentorRatingsAndFeedback(Integer mentorId) {
        User mentor = userRepository.findByUserId(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Selected user is not a mentor");
        }

        return consultationRepository.findByMentor(mentor).stream()
                .filter(c -> c.getStatus().equals(Consultation.Status.completed))
                .filter(c -> c.getRating() != null || c.getFeedback() != null)
                .map(consultationMapper::toDto)
                .toList();
    }

    public List<ConsultationDTO> getUserFeedbackAndRatings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!Boolean.TRUE.equals(user.getHasActive())) {
            throw new RuntimeException("User account is inactive");
        }

        return consultationRepository.findByUser(user).stream()
                .filter(c -> c.getStatus().equals(Consultation.Status.completed))
                .filter(c -> c.getRating() != null || c.getFeedback() != null)
                .map(consultationMapper::toDto)
                .toList();
    }

    public ConsultationDTO updateConsultationStatus(String updaterEmail, Integer consultationId, Consultation.Status newStatus) {
        User updater = userRepository.findByEmail(updaterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!"mentor".equals(updater.getRole().name()) && !"admin".equals(updater.getRole().name())) {
            throw new RuntimeException("Only mentor or admin can update consultation status");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        if (consultation.getStatus() == newStatus) {
            throw new RuntimeException("Consultation is already in the requested status");
        }

        if ("mentor".equals(updater.getRole().name()) && !consultation.getMentor().getUserId().equals(updater.getUserId())) {
            throw new RuntimeException("Mentor can only update their own consultations");
        }

        if (consultation.getStatus().equals(Consultation.Status.completed) && !newStatus.equals(Consultation.Status.cancelled)) {
            throw new RuntimeException("Cannot change status from completed except to cancelled");
        }
        if (consultation.getStatus().equals(Consultation.Status.cancelled)) {
            throw new RuntimeException("Cannot change status of a cancelled consultation");
        }

        consultation.setStatus(newStatus);
        return consultationMapper.toDto(consultationRepository.save(consultation));
    }

    public List<ConsultationDTO> getConsultationsForMentor(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Only mentors can view their consultations");
        }

        return consultationRepository.findByMentor(mentor).stream()
                .map(consultationMapper::toDto)
                .toList();
    }

    public void cancelConsultation(String userEmail, Integer consultationId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!Boolean.TRUE.equals(user.getHasActive())) {
            throw new RuntimeException("User account is inactive");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        // Chỉ chủ sở hữu (user) mới được phép hủy
        if (!consultation.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You are not authorized to cancel this consultation");
        }

        // Nếu đã completed hoặc đã hủy thì không được hủy lại
        if (consultation.getStatus() == Consultation.Status.completed) {
            throw new RuntimeException("Cannot cancel a completed consultation");
        }
        if (consultation.getStatus() == Consultation.Status.cancelled) {
            throw new RuntimeException("Consultation is already cancelled");
        }

        consultation.setStatus(Consultation.Status.cancelled);

        // Gỡ đánh dấu slot đã book → để người khác có thể đặt
        ConsultationSlot slot = consultation.getSlot();
        slot.setIsBooked(false);
        slotRepository.save(slot);

        consultationRepository.save(consultation);
    }

}
