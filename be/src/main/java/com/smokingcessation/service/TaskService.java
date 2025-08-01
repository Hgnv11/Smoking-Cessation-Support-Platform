package com.smokingcessation.service;

import com.smokingcessation.dto.UserSmokingProfileRequest;
import com.smokingcessation.dto.res.CreateTaskFreeDTO;
import com.smokingcessation.dto.res.TaskFreeResponseDTO;

import com.smokingcessation.model.*;
import com.smokingcessation.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskService {

    private final UserRepository userRepository;
    private final UserSmokingProfileService profileService;
    private final UserDependencyScoreRepository scoreRepository;
    private final PlanTasksFreeRepository taskRepository;
    private final SupportMeasureRepository supportMeasureRepository;
    private final TaskSupportMeasureRepository taskSupportMeasureRepository;
    private final UserSmokingProfileRepository userSmokingProfileRepository;

    public TaskService(
            UserRepository userRepository,
            UserSmokingProfileService profileService,
            UserDependencyScoreRepository scoreRepository,
            PlanTasksFreeRepository taskRepository,
            SupportMeasureRepository supportMeasureRepository,
            TaskSupportMeasureRepository taskSupportMeasureRepository, UserSmokingProfileRepository userSmokingProfileRepository) {
        this.userRepository = userRepository;
        this.profileService = profileService;
        this.scoreRepository = scoreRepository;
        this.taskRepository = taskRepository;
        this.supportMeasureRepository = supportMeasureRepository;
        this.taskSupportMeasureRepository = taskSupportMeasureRepository;
        this.userSmokingProfileRepository = userSmokingProfileRepository;
    }
    @Transactional
    public TaskFreeResponseDTO createTaskForFreeUser(String email, LocalDate date) {
        // Kiểm tra người dùng
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        if (user.getHasActive()) {
            throw new RuntimeException("Bạn đã có gói Pro, vui lòng sử dụng chức năng tạo nhiệm vụ Pro.");
        }

        boolean taskExists = taskRepository.existsByUserAndTaskDay(user, date);
        if (taskExists) {
            throw new RuntimeException("Bạn đã tạo nhiệm vụ cho ngày này rồi.");
        }

        // Lấy hồ sơ hút thuốc active
        UserSmokingProfile profile = userSmokingProfileRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch bỏ thuốc đang hoạt động"));

        // Lấy dependency_level
        UserDependencyScore score = scoreRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy điểm phụ thuộc cho user ID: " + user.getUserId()));

        // Tính target_cigarettes dựa trên dependency_level
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

        // Tạo nhiệm vụ
        PlanTasksFree task = new PlanTasksFree();
        task.setUser(user);
        task.setTaskDay(date);
        task.setTargetCigarettes(targetCigarettes);
        PlanTasksFree savedTask = taskRepository.save(task);

        // Chọn ngẫu nhiên 1-3 support measures
        List<SupportMeasure> allSupportMeasures = supportMeasureRepository.findAll();
        if (allSupportMeasures.isEmpty()) {
            throw new RuntimeException("Không có biện pháp hỗ trợ nào trong hệ thống");
        }
        Random random = new Random();
        int numberOfMeasures = random.nextInt(3) + 1; // Chọn ngẫu nhiên 1-3 biện pháp
        Collections.shuffle(allSupportMeasures);
        List<SupportMeasure> selectedMeasures = allSupportMeasures.subList(0, Math.min(numberOfMeasures, allSupportMeasures.size()));

        // Lưu vào task_support_measures và chuẩn bị DTO
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

        // Trả về response
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
        // Kiểm tra người dùng
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Lấy danh sách nhiệm vụ
        List<PlanTasksFree> tasks = taskRepository.findByUser_UserId(user.getUserId());

        // Chuyển đổi sang DTO
        return tasks.stream().map(task -> {
            TaskFreeResponseDTO response = new TaskFreeResponseDTO();
            response.setTaskId(task.getTaskId());
            response.setUserId(task.getUser().getUserId());
            response.setTaskDay(task.getTaskDay());
            response.setTargetCigarettes(task.getTargetCigarettes());
            response.setCreatedAt(LocalDateTime.now());
            response.setUpdatedAt(LocalDateTime.now());

            // Lấy danh sách support measures
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
}