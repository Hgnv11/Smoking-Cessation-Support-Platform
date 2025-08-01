package com.smokingcessation.service;

import com.smokingcessation.dto.res.TaskFreeResponseDTO;
import com.smokingcessation.model.*;
import com.smokingcessation.repository.*;
import com.smokingcessation.service.NotificationService;
import com.smokingcessation.service.UserSmokingProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final UserRepository userRepository;
    private final UserSmokingProfileService profileService;
    private final UserDependencyScoreRepository scoreRepository;
    private final PlanTasksFreeRepository taskRepository;
    private final SupportMeasureRepository supportMeasureRepository;
    private final TaskSupportMeasureRepository taskSupportMeasureRepository;
    private final UserSmokingProfileRepository userSmokingProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public TaskFreeResponseDTO createTaskForFreeUser(String email, LocalDate date) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        if (user.getHasActive()) {
            throw new RuntimeException("Bạn đã có gói Pro, vui lòng sử dụng chức năng tạo nhiệm vụ Pro.");
        }

        boolean taskExists = taskRepository.existsByUserAndTaskDay(user, date);
        if (taskExists) {
            throw new RuntimeException("Bạn đã tạo nhiệm vụ cho ngày này rồi.");
        }

        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch bỏ thuốc đang hoạt động"));

        UserDependencyScore score = scoreRepository.findTopByUserUserIdOrderByAssessmentDateDesc(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy điểm phụ thuộc cho user ID: " + user.getUserId()));

        int cigarettesPerDay = profile.getCigarettesPerDay();
        int targetCigarettes;
        switch (score.getDependencyLevel()) {
            case very_low:
                targetCigarettes = (int) (cigarettesPerDay * 0.9);
                break;
            case low:
                targetCigarettes = (int) (cigarettesPerDay * 0.85);
                break;
            case medium:
                targetCigarettes = (int) (cigarettesPerDay * 0.8);
                break;
            case high:
                targetCigarettes = (int) (cigarettesPerDay * 0.75);
                break;
            case very_high:
                targetCigarettes = (int) (cigarettesPerDay * 0.7);
                break;
            default:
                throw new RuntimeException("Mức độ phụ thuộc không hợp lệ");
        }

        PlanTasksFree task = new PlanTasksFree();
        task.setUser(user);
        task.setTaskDay(date);
        task.setTargetCigarettes(targetCigarettes);
        PlanTasksFree savedTask = taskRepository.save(task);

        List<SupportMeasure> allSupportMeasures = supportMeasureRepository.findAll();
        if (allSupportMeasures.isEmpty()) {
            throw new RuntimeException("Không có biện pháp hỗ trợ nào trong hệ thống");
        }
        Random random = new Random();
        int numberOfMeasures = random.nextInt(3) + 1;
        Collections.shuffle(allSupportMeasures);
        List<SupportMeasure> selectedMeasures = allSupportMeasures.subList(0, Math.min(numberOfMeasures, allSupportMeasures.size()));

        List<TaskFreeResponseDTO.SupportMeasureDTO> supportMeasureDTOs = new ArrayList<>();
        for (SupportMeasure supportMeasure : selectedMeasures) {
            TaskSupportMeasure taskSupportMeasure = new TaskSupportMeasure();
            taskSupportMeasure.setPlanTaskFree(savedTask);
            taskSupportMeasure.setSupportMeasure(supportMeasure);
            taskSupportMeasureRepository.save(taskSupportMeasure);

            TaskFreeResponseDTO.SupportMeasureDTO dto = new TaskFreeResponseDTO.SupportMeasureDTO();
            dto.setSupportMeasuresId(supportMeasure.getSupportMeasuresId());
            dto.setSupportMeasures(supportMeasure.getSupportMeasures());
            supportMeasureDTOs.add(dto);
        }

        TaskFreeResponseDTO response = new TaskFreeResponseDTO();
        response.setTaskId(savedTask.getTaskId());
        response.setUserId(savedTask.getUser().getUserId());
        response.setTaskDay(savedTask.getTaskDay());
        response.setTargetCigarettes(savedTask.getTargetCigarettes());
        response.setSupportMeasures(supportMeasureDTOs);
        response.setCreatedAt(savedTask.getCreatedAt());
        response.setUpdatedAt(savedTask.getUpdatedAt());

        return response;
    }

    public List<TaskFreeResponseDTO> getTasksByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<PlanTasksFree> tasks = taskRepository.findByUser_UserId(user.getUserId());

        return tasks.stream().map(task -> {
            TaskFreeResponseDTO response = new TaskFreeResponseDTO();
            response.setTaskId(task.getTaskId());
            response.setUserId(task.getUser().getUserId());
            response.setTaskDay(task.getTaskDay());
            response.setTargetCigarettes(task.getTargetCigarettes());
            response.setCreatedAt(LocalDateTime.now());
            response.setUpdatedAt(LocalDateTime.now());

            List<TaskSupportMeasure> taskSupportMeasures = taskSupportMeasureRepository.findByPlanTaskFree_TaskId(task.getTaskId());
            List<TaskFreeResponseDTO.SupportMeasureDTO> supportMeasureDTOs = taskSupportMeasures.stream()
                    .map(tsm -> {
                        TaskFreeResponseDTO.SupportMeasureDTO dto = new TaskFreeResponseDTO.SupportMeasureDTO();
                        dto.setSupportMeasuresId(tsm.getSupportMeasure().getSupportMeasuresId());
                        dto.setSupportMeasures(tsm.getSupportMeasure().getSupportMeasures());
                        return dto;
                    })
                    .collect(Collectors.toList());
            response.setSupportMeasures(supportMeasureDTOs);

            return response;
        }).collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 19 * * ?", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void sendNoTaskNotificationsForFreeUsers() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<User> freeUsers = userRepository.findByHasActiveFalse();
        for (User user : freeUsers) {
            boolean hasTask = taskRepository.existsByUserAndTaskDay(user, tomorrow);
            if (!hasTask) {
                notificationService.createNoTaskNotification(user, tomorrow);
            }
        }
    }

    @Scheduled(cron = "0 0 8 * * ?", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void sendMorningTaskRemindersForFreeUsers() {
        LocalDate today = LocalDate.now();
        List<User> freeUsers = userRepository.findByHasActiveFalse();
        for (User user : freeUsers) {
            List<PlanTasksFree> tasks = taskRepository.findByUserAndTaskDay(user, today);
            for (PlanTasksFree task : tasks) {
                notificationService.createFreeTaskReminderNotification(user, task.getTargetCigarettes());
            }
        }
    }
}
