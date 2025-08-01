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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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

    @Transactional
    public PlanTasksProDTO assignTask(String mentorEmail, PlanTasksProDTO request) {
        // Validate mentor
        User mentor = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        if (!"mentor".equals(mentor.getRole().name())) {
            throw new RuntimeException("Only mentors can assign tasks");
        }

        // Validate user
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if there is a completed consultation between mentor and user
        boolean hasCompletedConsultation = consultationService.getConsultationsForMentor(mentorEmail)
                .stream()
                .anyMatch(c -> c.getUser().getUserId()==(user.getUserId()) &&
                        c.getStatus().equals(Consultation.Status.completed.name()));
        if (!hasCompletedConsultation) {
            throw new RuntimeException("No completed consultation found between mentor and user");
        }

        // Validate task details
        if (request.getTaskDay() == null || request.getTaskDay().isBefore(LocalDate.now())) {
            throw new RuntimeException("Task day must be provided and cannot be in the past");
        }

        boolean taskExists = planTasksProRepository
                .existsByUserAndTaskDay(user, request.getTaskDay());
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

        // Create and save task
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

        // Check if mentor has a completed consultation with the user
        boolean hasCompletedConsultation = consultationService.getConsultationsForMentor(mentorEmail)
                .stream()
                .anyMatch(c -> c.getUser().getUserId() == (user.getUserId()) &&
                        c.getStatus().equals(Consultation.Status.completed.name()));
        if (!hasCompletedConsultation) {
            throw new RuntimeException("No completed consultation found between mentor and user");
        }

        // Fetch smoking profile
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

        // Fetch dependency score
        var dependencyScoreDTO = dependencyService.getUserScore(user.getUserId());
        UserSmokingHistoryDTO.DependencyScoreDTO dependencyScore = UserSmokingHistoryDTO.DependencyScoreDTO.builder()
                .totalScore(dependencyScoreDTO.getTotalScore())
                .dependencyLevel(dependencyScoreDTO.getDependencyLevel())
                .build();

        // Fetch triggers
        List<Trigger> triggers = triggerService.getAllCategories().stream()
                .flatMap(category -> triggerService.getTriggersByCategoryId(category.getCategoryId()).stream())
                .collect(Collectors.toList());
        List<String> triggerNames = triggers.stream()
                .map(Trigger::getName)
                .collect(Collectors.toList());

        // Fetch reasons for quitting
        List<String> reasons = reasonService.getMyReasons(user.getEmail()).stream()
                .map(ReasonDTO::getReasonText)
                .collect(Collectors.toList());

        // Fetch days since last smoke
        Long daysSinceLastSmoke = userSmokingProfileService.getDaysSinceLastSmoke(user.getEmail());

        return UserSmokingHistoryDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .smokingProfile(smokingProfile)
                .dependencyScore(dependencyScore)
                .triggers(triggerNames)
                .reasonsForQuitting(reasons)
                .daysSinceLastSmoke(daysSinceLastSmoke)
                .build();
    }

    @Transactional
    public PlanTasksProDTO updateTask(Integer taskId, String mentorEmail, PlanTasksProDTO request) {
        PlanTasksPro task = planTasksProRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getMentor().getEmail().equals(mentorEmail)) {
            throw new RuntimeException("Only the assigned mentor can update this task");
        }

        // Validate and apply changes
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

}