package com.smokingcessation.service;

import com.smokingcessation.dto.res.PlanTasksProDTO;
import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.dto.res.UserSmokingHistoryDTO;
import com.smokingcessation.mapper.PlanTasksProMapper;
import com.smokingcessation.model.Consultation;
import com.smokingcessation.model.PlanTasksPro;
import com.smokingcessation.model.Trigger;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.PlanTasksProRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanTasksProService {

    private final PlanTasksProRepository planTasksProRepository;
    private final UserRepository userRepository;
    private final ConsultationService consultationService;
    private final PlanTasksProMapper planTasksProMapper;
    private final UserSmokingProfileService userSmokingProfileService;
    private final DependencyService dependencyService;
    private final TriggerService triggerService;
    private final ReasonService reasonService;
    private final NotificationService notificationService;
    private final SmokingEventService smokingEventService;

    @Transactional
    public PlanTasksProDTO assignTask(String mentorEmail, PlanTasksProDTO request) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Only mentors can assign tasks");
        }

        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasCompletedConsultation = consultationService.getConsultationsForMentor(mentorEmail)
                .stream()
                .anyMatch(c -> c.getUser().getUserId() == user.getUserId() &&
                        c.getStatus().equals(Consultation.Status.completed.name()));
        if (!hasCompletedConsultation) {
            throw new RuntimeException("No completed consultation found between mentor and user");
        }

        if (request.getTaskDay() == null || request.getTaskDay().isBefore(LocalDate.now())) {
            throw new RuntimeException("Task day must be provided and cannot be in the past");
        }

        boolean taskExists = planTasksProRepository.existsByUserAndTaskDay(user, request.getTaskDay());
        if (taskExists) {
            throw new RuntimeException("User already has a task assigned for this day");
        }

        if (request.getTargetCigarettes() == null || request.getTargetCigarettes() < 0) {
            throw new RuntimeException("Target cigarettes must be provided and non-negative");
        }
        if (request.getCustomSupportMeasures() == null || request.getCustomSupportMeasures().trim().isEmpty()) {
            throw new RuntimeException("Custom support measures must be provided and cannot be empty");
        }
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            request.setStatus("pending");
        }

        PlanTasksPro task = PlanTasksPro.builder()
                .user(user)
                .mentor(mentor)
                .taskDay(request.getTaskDay())
                .customSupportMeasures(request.getCustomSupportMeasures())
                .targetCigarettes(request.getTargetCigarettes())
                .status(PlanTasksPro.Status.valueOf(request.getStatus()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        PlanTasksPro savedTask = planTasksProRepository.save(task);
        notificationService.createTaskAssignmentNotification(user, mentor, request.getTaskDay(), request.getTargetCigarettes());

        return planTasksProMapper.toDto(savedTask);
    }

    public List<PlanTasksProDTO> getTasksByUserAndMentor(String mentorEmail, Integer userId) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Only mentors can view tasks");
        }
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return planTasksProRepository.findByMentorAndUser(mentor, user)
                .stream()
                .map(planTasksProMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<PlanTasksProDTO> getUserTasks(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return planTasksProRepository.findByUser(user)
                .stream()
                .map(planTasksProMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlanTasksProDTO updateTaskStatus(String userEmail, Integer taskId, String newStatus) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        PlanTasksPro task = planTasksProRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("User is not authorized to update this task");
        }
        try {
            task.setStatus(PlanTasksPro.Status.valueOf(newStatus));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
        task.setUpdatedAt(LocalDateTime.now());
        PlanTasksPro updatedTask = planTasksProRepository.save(task);
        return planTasksProMapper.toDto(updatedTask);
    }

    public UserSmokingHistoryDTO getUserSmokingHistory(String mentorEmail, Integer userId) {
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Only mentors can view user smoking history");
        }
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasCompletedConsultation = consultationService.getConsultationsForMentor(mentorEmail)
                .stream()
                .anyMatch(c -> c.getUser().getUserId() == user.getUserId() &&
                        c.getStatus().equals(Consultation.Status.completed.name()));
        if (!hasCompletedConsultation) {
            throw new RuntimeException("No completed consultation found between mentor and user");
        }

        UserSmokingHistoryDTO.SmokingProfileDTO smokingProfile = null;
        var profiles = userSmokingProfileService.getAllProfilesByEmail(user.getEmail());
        var activeProfile = profiles.stream()
                .filter(p -> "active".equals(p.getStatus()))
                .findFirst();
        if (activeProfile.isPresent()) {
            var profile = activeProfile.get();
            smokingProfile = UserSmokingHistoryDTO.SmokingProfileDTO.builder()
                    .cigarettesPerDay(profile.getCigarettesPerDay())
                    .quitDate(profile.getQuitDate())
                    .endDate(profile.getEndDate())
                    .status(profile.getStatus())
                    .build();
        }

        var dependencyScoreDTO = dependencyService.getUserScore(user.getUserId());
        UserSmokingHistoryDTO.DependencyScoreDTO dependencyScore = UserSmokingHistoryDTO.DependencyScoreDTO.builder()
                .totalScore(dependencyScoreDTO.getTotalScore())
                .dependencyLevel(dependencyScoreDTO.getDependencyLevel())
                .build();

        List<Trigger> triggers = triggerService.getTriggersByUserId(user.getUserId());
        List<String> triggerNames = triggers.stream()
                .map(Trigger::getName)
                .collect(Collectors.toList());

        List<String> reasons = reasonService.getMyReasons(user.getEmail()).stream()
                .map(ReasonDTO::getReasonText)
                .collect(Collectors.toList());

        Long daysSinceLastSmoke = userSmokingProfileService.getDaysSinceLastSmoke(user.getEmail());

        // Aggregate smoking events by date and sum cigarettes smoked
        List<UserSmokingHistoryDTO.SmokingEventDTO> smokingEvents = smokingEventService.getSmokingEventsByUserId(user.getUserId())
                .stream()
                .collect(Collectors.groupingBy(
                        event -> event.getEventTime().toLocalDate(),
                        Collectors.summingInt(event -> event.getCigarettesSmoked())))
                .entrySet().stream()
                .map(entry -> UserSmokingHistoryDTO.SmokingEventDTO.builder()
                        .eventDate(entry.getKey().atStartOfDay())
                        .cigarettesSmoked(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        return UserSmokingHistoryDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .smokingProfile(smokingProfile)
                .dependencyScore(dependencyScore)
                .triggers(triggerNames)
                .reasonsForQuitting(reasons)
                .daysSinceLastSmoke(daysSinceLastSmoke)
                .smokingEvents(smokingEvents)
                .build();
    }

    @Transactional
    public PlanTasksProDTO updateTask(Integer taskId, String mentorEmail, PlanTasksProDTO request) {
        PlanTasksPro task = planTasksProRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getMentor().getEmail().equals(mentorEmail)) {
            throw new RuntimeException("Only the assigned mentor can update this task");
        }

        if (request.getTargetCigarettes() != null && request.getTargetCigarettes() >= 0) {
            task.setTargetCigarettes(request.getTargetCigarettes());
        }

        if (request.getCustomSupportMeasures() != null && !request.getCustomSupportMeasures().trim().isEmpty()) {
            task.setCustomSupportMeasures(request.getCustomSupportMeasures());
        }

        if (request.getStatus() != null) {
            task.setStatus(PlanTasksPro.Status.valueOf(request.getStatus()));
        }

        task.setUpdatedAt(LocalDateTime.now());
        return planTasksProMapper.toDto(planTasksProRepository.save(task));
    }

    @Scheduled(cron = "0 0 8 * * ?", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void sendMorningTaskRemindersForProUsers() {
        LocalDate today = LocalDate.now();
        List<User> proUsers = userRepository.findByHasActiveTrue();
        for (User user : proUsers) {
            List<PlanTasksPro> tasks = planTasksProRepository.findByUserAndTaskDay(user, today);
            for (PlanTasksPro task : tasks) {
                notificationService.createProTaskReminderNotification(user, task.getMentor(), task.getTargetCigarettes());
            }
        }
    }
}