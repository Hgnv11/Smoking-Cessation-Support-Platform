package com.smokingcessation.service;

import com.smokingcessation.dto.res.TaskFreeCreateDTO;
import com.smokingcessation.dto.res.SupportMeasureResponseDTO;
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
import java.util.List;
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

    // Get all support measures for user selection
    public List<SupportMeasureResponseDTO> getAllSupportMeasures() {
        return supportMeasureRepository.findAll().stream()
                .map(sm -> {
                    SupportMeasureResponseDTO dto = new SupportMeasureResponseDTO();
                    dto.setSupportMeasuresId(sm.getSupportMeasuresId());
                    dto.setSupportMeasures(sm.getSupportMeasures());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Create task with user-selected support measures and target cigarettes
    @Transactional
    public TaskFreeResponseDTO createTaskForFreeUser(String email, TaskFreeCreateDTO createDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        LocalDate date = createDTO.getTaskDay();
        boolean taskExists = taskRepository.existsByUserAndTaskDay(user, date);
        if (taskExists) {
            throw new RuntimeException("Bạn đã tạo nhiệm vụ cho ngày này rồi.");
        }

        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch bỏ thuốc đang hoạt động"));

        // Validate target cigarettes
        if (createDTO.getTargetCigarettes() <= 0) {
            throw new RuntimeException("Số thuốc mục tiêu phải lớn hơn 0.");
        }

        PlanTasksFree task = new PlanTasksFree();
        task.setUser(user);
        task.setTaskDay(date);
        task.setTargetCigarettes(createDTO.getTargetCigarettes());
        task.setStatus(PlanTasksFree.Status.pending);
        PlanTasksFree savedTask = taskRepository.save(task);

        // Save selected support measures
        List<TaskFreeResponseDTO.SupportMeasureDTO> supportMeasureDTOs = new ArrayList<>();
        for (Integer supportMeasureId : createDTO.getSupportMeasureIds()) {
            SupportMeasure supportMeasure = supportMeasureRepository.findById(supportMeasureId)
                    .orElseThrow(() -> new RuntimeException("Support measure not found: " + supportMeasureId));

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
        response.setStatus(savedTask.getStatus().name());
        response.setSupportMeasures(supportMeasureDTOs);
        response.setCreatedAt(savedTask.getCreatedAt());
        response.setUpdatedAt(savedTask.getUpdatedAt());

        return response;
    }

    // Get tasks by email
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
            response.setStatus(task.getStatus().name());
            response.setCreatedAt(task.getCreatedAt());
            response.setUpdatedAt(task.getUpdatedAt());

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

    // Update task
    @Transactional
    public TaskFreeResponseDTO updateTaskForFreeUser(String email, Integer taskId, TaskFreeCreateDTO updateDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        PlanTasksFree task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        if (!task.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to update this task.");
        }

        task.setTaskDay(updateDTO.getTaskDay());
        task.setTargetCigarettes(updateDTO.getTargetCigarettes());
        task.setStatus(PlanTasksFree.Status.valueOf(updateDTO.getStatus()));
        PlanTasksFree updatedTask = taskRepository.save(task);

        // Remove existing support measures
        taskSupportMeasureRepository.deleteByPlanTaskFree_TaskId(taskId);

        // Add new support measures
        List<TaskFreeResponseDTO.SupportMeasureDTO> supportMeasureDTOs = new ArrayList<>();
        for (Integer supportMeasureId : updateDTO.getSupportMeasureIds()) {
            SupportMeasure supportMeasure = supportMeasureRepository.findById(supportMeasureId)
                    .orElseThrow(() -> new RuntimeException("Support measure not found: " + supportMeasureId));

            TaskSupportMeasure taskSupportMeasure = new TaskSupportMeasure();
            taskSupportMeasure.setPlanTaskFree(updatedTask);
            taskSupportMeasure.setSupportMeasure(supportMeasure);
            taskSupportMeasureRepository.save(taskSupportMeasure);

            TaskFreeResponseDTO.SupportMeasureDTO dto = new TaskFreeResponseDTO.SupportMeasureDTO();
            dto.setSupportMeasuresId(supportMeasure.getSupportMeasuresId());
            dto.setSupportMeasures(supportMeasure.getSupportMeasures());
            supportMeasureDTOs.add(dto);
        }

        TaskFreeResponseDTO response = new TaskFreeResponseDTO();
        response.setTaskId(updatedTask.getTaskId());
        response.setUserId(updatedTask.getUser().getUserId());
        response.setTaskDay(updatedTask.getTaskDay());
        response.setTargetCigarettes(updatedTask.getTargetCigarettes());
        response.setStatus(updatedTask.getStatus().name());
        response.setSupportMeasures(supportMeasureDTOs);
        response.setCreatedAt(updatedTask.getCreatedAt());
        response.setUpdatedAt(updatedTask.getUpdatedAt());

        return response;
    }

    // Delete task
    @Transactional
    public void deleteTaskForFreeUser(String email, Integer taskId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        PlanTasksFree task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        if (!task.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to delete this task.");
        }

        taskSupportMeasureRepository.deleteByPlanTaskFree_TaskId(taskId);
        taskRepository.delete(task);
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

    @Transactional
    public TaskFreeResponseDTO updateTaskStatusForUser(String email, Integer taskId, String status) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        PlanTasksFree task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        if (!task.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to update this task.");
        }

        try {
            task.setStatus(PlanTasksFree.Status.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        PlanTasksFree updatedTask = taskRepository.save(task);

        List<TaskSupportMeasure> taskSupportMeasures = taskSupportMeasureRepository.findByPlanTaskFree_TaskId(taskId);
        List<TaskFreeResponseDTO.SupportMeasureDTO> supportMeasureDTOs = taskSupportMeasures.stream()
                .map(tsm -> {
                    TaskFreeResponseDTO.SupportMeasureDTO dto = new TaskFreeResponseDTO.SupportMeasureDTO();
                    dto.setSupportMeasuresId(tsm.getSupportMeasure().getSupportMeasuresId());
                    dto.setSupportMeasures(tsm.getSupportMeasure().getSupportMeasures());
                    return dto;
                }).collect(Collectors.toList());

        TaskFreeResponseDTO response = new TaskFreeResponseDTO();
        response.setTaskId(updatedTask.getTaskId());
        response.setUserId(updatedTask.getUser().getUserId());
        response.setTaskDay(updatedTask.getTaskDay());
        response.setTargetCigarettes(updatedTask.getTargetCigarettes());
        response.setStatus(updatedTask.getStatus().name());
        response.setSupportMeasures(supportMeasureDTOs);
        response.setCreatedAt(updatedTask.getCreatedAt());
        response.setUpdatedAt(updatedTask.getUpdatedAt());

        return response;
    }

}