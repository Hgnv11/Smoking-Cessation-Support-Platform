package com.smokingcessation.service;

import com.smokingcessation.dto.dashboard.*;
import com.smokingcessation.dto.res.ConsultationDTO;
import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.mapper.ConsultationMapper;
import com.smokingcessation.mapper.SmokingEventMapper;
import com.smokingcessation.mapper.UserMapper;
import com.smokingcessation.model.*;
import com.smokingcessation.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final ConsultationSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final ConsultationMapper consultationMapper;
    private final UserMapper userMapper;
    private final SmokingEventRepository smokingEventRepository;
    private final UserSmokingProfileRepository userSmokingProfileRepository;
    private final SmokingEventService smokingEventService;
    private final UserSmokingProfileService userSmokingProfileService;


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

    public void updateFeedback(String userEmail, Integer consultationId, Integer rating, String feedback) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!Boolean.TRUE.equals(user.getHasActive())) {
            throw new RuntimeException("User account is inactive");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        if (!consultation.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to update feedback");
        }
        if (!consultation.getStatus().equals(Consultation.Status.completed)) {
            throw new RuntimeException("Can only update feedback for completed consultations");
        }
        if (rating < 0 || rating > 5) {
            throw new RuntimeException("Rating must be between 0 and 5");
        }
        if (consultation.getRating() == null && consultation.getFeedback() == null) {
            throw new RuntimeException("No existing feedback to update");
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

    public ConsultationDTO getUserConsultationDetail(Integer consultationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!Boolean.TRUE.equals(user.getHasActive())) {
            throw new RuntimeException("User account is inactive");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        if (!consultation.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You are not authorized to view this consultation");
        }

        return consultationMapper.toDto(consultation);
    }

    public MentorDashboardDTO getMentorDashboardOverview(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        List<ConsultationSlot> slots = slotRepository.findByMentor(mentor);
        List<Consultation> consultations = consultationRepository.findByMentor(mentor);

        LocalDate today = LocalDate.now();
        long todayBooked = slots.stream()
                .filter(s -> s.getSlotDate().equals(today) && Boolean.TRUE.equals(s.getIsBooked()))
                .count();

        long totalDaysWithAppointments = consultations.stream()
                .map(c -> c.getSlot().getSlotDate())
                .distinct()
                .count();

        long totalBooked = slots.stream().filter(s -> Boolean.TRUE.equals(s.getIsBooked())).count();
        long available = slots.stream().filter(s -> Boolean.FALSE.equals(s.getIsBooked())).count();

        long uniqueClients = consultations.stream()
                .map(Consultation::getUser)
                .map(User::getUserId)
                .distinct()
                .count();

        return MentorDashboardDTO.builder()
                .todayBookedSlots((int) todayBooked)
                .totalAppointmentDays((int) totalDaysWithAppointments)
                .totalBookedSlots((int) totalBooked)
                .availableSlots((int) available)
                .uniqueClients((int) uniqueClients)
                .build();
    }

    public List<SlotSummaryDTO> getTodayConsultationsForMentor(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        LocalDate today = LocalDate.now();

        List<Consultation> consultations = consultationRepository
                .findByMentorAndSlot_SlotDate(mentor, today);

        return consultations.stream()
                .map(c -> SlotSummaryDTO.builder()
                        .consultationId(c.getConsultationId())
                        .slotId(c.getSlot().getSlotId())
                        .slotNumber(c.getSlot().getSlotNumber())
                        .slotDate(c.getSlot().getSlotDate())
                        .clientName(c.getUser().getFullName())
                        .status(c.getStatus().name())
                        .build())
                .toList();
    }



    public void completeConsultation(Integer consultationId, String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        if (!consultation.getMentor().getUserId().equals(mentor.getUserId())) {
            throw new RuntimeException("Unauthorized to mark complete");
        }

        if (!consultation.getStatus().equals(Consultation.Status.scheduled)) {
            throw new RuntimeException("Only scheduled consultations can be completed");
        }

        consultation.setStatus(Consultation.Status.completed);
        consultationRepository.save(consultation);
    }

    public List<UserDTO> getUsersConsultedWithMentor(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Only mentors can use this feature");
        }

        List<Consultation> consultations = consultationRepository.findByMentor(mentor);

        // Lấy danh sách unique user
        return consultations.stream()
                .map(Consultation::getUser)
                .distinct()
                .map(userMapper::toDto)
                .toList();
    }

    public List<SlotSummaryDTO> getConsultationSummariesWithUser(String mentorEmail, Integer userId) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Consultation> consultations = consultationRepository
                .findByMentorAndUser(mentor, user);

        return consultations.stream()
                .map(c -> SlotSummaryDTO.builder()
                        .consultationId(c.getConsultationId())
                        .slotId(c.getSlot().getSlotId())
                        .slotNumber(c.getSlot().getSlotNumber())
                        .slotDate(c.getSlot().getSlotDate())
                        .status(c.getStatus().name())
                        .clientName(user.getFullName())
                        .build())
                .toList();
    }

    public ConsultationDTO getConsultationDetailWithUser(String mentorEmail, Integer consultationId) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        if (!consultation.getMentor().getUserId().equals(mentor.getUserId()) ||
                !consultation.getUser().getUserId().equals(consultation.getUser().getUserId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return consultationMapper.toDto(consultation);
    }
    public ClientManagementDTO getClientManagementStats(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // Lấy tất cả consultations của mentor
        List<Consultation> consultations = consultationRepository.findByMentor(mentor);

        // Lấy danh sách user duy nhất
        Set<User> clients = consultations.stream()
                .map(Consultation::getUser)
                .filter(user -> "user".equalsIgnoreCase(user.getRole().name())) // chỉ lấy user role
                .collect(Collectors.toSet());

        int totalClients = clients.size();

        int premiumClients = (int) clients.stream()
                .filter(user -> Boolean.TRUE.equals(user.getHasActive()))
                .count();

        int highCravingClients = (int) clients.stream()
                .filter(user -> smokingEventRepository.existsByUserAndCravingLevelGreaterThan(user, 7))
                .count();

        BigDecimal totalMoneySaved = clients.stream()
                .flatMap(user -> smokingEventService.getAllSmokingProgressByUser(user.getUserId()).stream())
                .map(progress -> progress.getMoneySaved() != null ? progress.getMoneySaved() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);


        return ClientManagementDTO.builder()
                .totalClients(totalClients)
                .premiumClients(premiumClients)
                .highCravingClients(highCravingClients)
                .totalMoneySaved(totalMoneySaved.setScale(0, RoundingMode.HALF_UP))
                .build();
    }

    public List<ClientProgressDTO> getClientProgress(String mentorEmail) {
        List<Consultation> consultations = consultationRepository.findByMentor_Email(mentorEmail);

        Set<User> clients = consultations.stream()
                .map(Consultation::getUser)
                .filter(user -> "user".equalsIgnoreCase(user.getRole().name()))
                .collect(Collectors.toSet());

        List<ClientProgressDTO> results = new ArrayList<>();

        for (User client : clients) {
            Optional<UserSmokingProfile> profileOpt = userSmokingProfileRepository
                    .findByUserAndStatus(client, "active");

            if (profileOpt.isEmpty()) continue;
            UserSmokingProfile profile = profileOpt.get();

            int smokeFreeDays = (int) userSmokingProfileService.getDaysSinceLastSmoke(client.getEmail());

            int sessionsAttended = (int) consultations.stream()
                    .filter(c -> c.getUser().equals(client))
                    .count();

            double successRate = userSmokingProfileService.calculateSuccessRate(profile, client);
            double successRatePercent = Math.round(successRate * 10000.0) / 100.0;

            String status = getStatus(successRate);

            results.add(ClientProgressDTO.builder()
                    .clientName(client.getFullName())
                    .smokeFreeDays(smokeFreeDays)
                    .sessionsAttended(sessionsAttended)
                    .successRate(successRatePercent)
                    .status(status)
                    .build());
        }

        return results;
    }

    private String getStatus(double rate) {
        if (rate >= 0.85) return "Excellent";
        else if (rate >= 0.7) return "Good";
        else return "Needs Support";
    }

    public MentorReportDTO getMentorReport(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // 1. Tổng số buổi tư vấn completed trong tháng này
        LocalDate now = LocalDate.now();
        int totalSessionsThisMonth = consultationRepository
                .findByMentorAndStatus(mentor, Consultation.Status.completed).stream()
                .filter(c -> c.getSlot().getSlotDate().getMonth() == now.getMonth() &&
                        c.getSlot().getSlotDate().getYear() == now.getYear())
                .toList().size();

        // 2. Tính successRate trung bình từ các profile
        List<Consultation> consultations = consultationRepository.findByMentor(mentor);

        Set<User> clients = consultations.stream()
                .map(Consultation::getUser)
                .filter(user -> "user".equalsIgnoreCase(user.getRole().name()))
                .collect(Collectors.toSet());

        double totalSuccessRate = 0;
        int count = 0;
        for (User user : clients) {
            Optional<UserSmokingProfile> profileOpt = userSmokingProfileRepository.findByUserAndStatus(user, "active");
            if (profileOpt.isPresent()) {
                double rate = userSmokingProfileService.calculateSuccessRate(profileOpt.get(), user);
                totalSuccessRate += rate;
                count++;
            }
        }
        double successRate = count == 0 ? 0 : Math.round((totalSuccessRate / count) * 10000.0) / 100.0;

        // 3. Tỷ lệ giữ chân (clientRetentionRate)
        long totalClients = consultations.stream().map(Consultation::getUser).distinct().count();
        long clientsWithMultipleSessions = consultations.stream()
                .collect(Collectors.groupingBy(Consultation::getUser, Collectors.counting()))
                .values().stream().filter(c -> c > 1).count();
        double clientRetentionRate = totalClients == 0 ? 0 : Math.round((clientsWithMultipleSessions * 10000.0 / totalClients)) / 100.0;

        // 4. Tỷ lệ hoàn thành session
        long completedSessions = consultations.stream()
                .filter(c -> c.getStatus() == Consultation.Status.completed)
                .count();
        long totalSessions = consultations.size();
        double sessionCompletionRate = totalSessions == 0 ? 0 : Math.round((completedSessions * 10000.0 / totalSessions)) / 100.0;

        return MentorReportDTO.builder()
                .totalSessionsThisMonth(totalSessionsThisMonth)
                .successRate(successRate)
                .clientRetentionRate(clientRetentionRate)
                .sessionCompletionRate(sessionCompletionRate)
                .build();
    }




}
