package com.smokingcessation.service;

import com.smokingcessation.dto.res.UserTriggerDTO;
import com.smokingcessation.model.Trigger;
import com.smokingcessation.model.TriggerCategory;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserTrigger;
import com.smokingcessation.repository.TriggerRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.UserTriggerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserTriggerService {

    private final UserTriggerRepository userTriggerRepository;
    private final UserRepository userRepository;
    private final TriggerRepository triggerRepository;

    // Helper: get user by email
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }

    private User getUserById(Integer userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại: " + userId));
    }

    public List<UserTriggerDTO> getUserTriggersByUserId(Integer userId) {
        User user = getUserById(userId);

        List<UserTrigger> userTriggers = userTriggerRepository.findByUserUserId(userId);

        Map<TriggerCategory, List<Trigger>> triggersByCategory = userTriggers.stream()
                .collect(Collectors.groupingBy(
                        ut -> ut.getTrigger().getCategory(),
                        Collectors.mapping(UserTrigger::getTrigger, Collectors.toList())
                ));

        List<TriggerCategory> triggerCategories = triggersByCategory.entrySet().stream()
                .map(entry -> TriggerCategory.builder()
                        .categoryId(entry.getKey().getCategoryId())
                        .name(entry.getKey().getName())
                        .triggers(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        UserTriggerDTO dto = UserTriggerDTO.builder()
                .userId(userId)
                .triggerCategories(triggerCategories)
                .build();

        return List.of(dto);
    }

    public List<UserTriggerDTO> getUserTriggersByEmail(String email) {
        User user = getUserByEmail(email);
        Integer userId = user.getUserId();

        List<UserTrigger> userTriggers = userTriggerRepository.findByUserUserId(userId);

        // Group triggers by category using traditional for-loop
        Map<TriggerCategory, List<Trigger>> triggersByCategory = new HashMap<>();

        for (UserTrigger ut : userTriggers) {
            Trigger trigger = ut.getTrigger();
            TriggerCategory category = trigger.getCategory();

            // Nếu chưa có category này trong map thì thêm mới
            if (!triggersByCategory.containsKey(category)) {
                triggersByCategory.put(category, new ArrayList<>());
            }

            triggersByCategory.get(category).add(trigger);
        }

        // Chuyển thành danh sách triggerCategories
        List<TriggerCategory> triggerCategories = new ArrayList<>();
        for (Map.Entry<TriggerCategory, List<Trigger>> entry : triggersByCategory.entrySet()) {
            TriggerCategory originalCategory = entry.getKey();
            List<Trigger> triggers = entry.getValue();

            // Tạo bản sao của TriggerCategory (không làm thay đổi dữ liệu gốc)
            TriggerCategory categoryDTO = TriggerCategory.builder()
                    .categoryId(originalCategory.getCategoryId())
                    .name(originalCategory.getName())
                    .triggers(triggers)
                    .build();

            triggerCategories.add(categoryDTO);
        }

        // Tạo DTO kết quả
        UserTriggerDTO dto = UserTriggerDTO.builder()
                .userId(userId)
                .triggerCategories(triggerCategories)
                .build();

        return List.of(dto);
    }

    @Transactional
    public List<UserTriggerDTO> createMultipleUserTriggersByEmail(String email, List<Integer> triggerIds) {
        User user = getUserByEmail(email);
        Integer userId = user.getUserId();

        LocalDateTime now = LocalDateTime.now();
        for (Integer triggerId : triggerIds) {
            if (userTriggerRepository.existsByUserUserIdAndTriggerTriggerId(userId, triggerId)) continue;

            Trigger trigger = triggerRepository.findById(triggerId)
                    .orElseThrow(() -> new RuntimeException("Trigger không tồn tại: " + triggerId));

            UserTrigger userTrigger = UserTrigger.builder()
                    .user(user)
                    .trigger(trigger)
                    .createdAt(now)
                    .build();

            userTriggerRepository.save(userTrigger);
        }

        return getUserTriggersByEmail(email);
    }

    @Transactional
    public List<UserTriggerDTO> syncUserTriggersByEmail(String email, List<Integer> selectedTriggerIds) {
        User user = getUserByEmail(email);
        Integer userId = user.getUserId();

        // Lấy danh sách triggerId hiện tại của người dùng
        List<UserTrigger> existingTriggers = userTriggerRepository.findByUserUserId(userId);
        Set<Integer> existingTriggerIds = existingTriggers.stream()
                .map(ut -> ut.getTrigger().getTriggerId())
                .collect(Collectors.toSet());

        // Lấy danh sách triggerId được chọn từ client
        Set<Integer> selectedTriggerIdSet = Set.copyOf(selectedTriggerIds);

        // Xác định các triggerId cần thêm (có trong selected nhưng không có trong existing)
        List<Integer> triggersToAdd = selectedTriggerIds.stream()
                .filter(id -> !existingTriggerIds.contains(id))
                .toList();

        // Xác định các triggerId cần xóa (có trong existing nhưng không có trong selected)
        List<Integer> triggersToRemove = existingTriggerIds.stream()
                .filter(id -> !selectedTriggerIdSet.contains(id))
                .toList();

        // Thêm các UserTrigger mới
        LocalDateTime now = LocalDateTime.now();
        for (Integer triggerId : triggersToAdd) {
            Trigger trigger = triggerRepository.findById(triggerId)
                    .orElseThrow(() -> new RuntimeException("Trigger không tồn tại: " + triggerId));

            UserTrigger userTrigger = UserTrigger.builder()
                    .user(user)
                    .trigger(trigger)
                    .createdAt(now)
                    .build();

            userTriggerRepository.save(userTrigger);
        }

        // Xóa các UserTrigger không còn được chọn
        for (Integer triggerId : triggersToRemove) {
            userTriggerRepository.deleteByUserUserIdAndTriggerTriggerId(userId, triggerId);
        }

        // Trả về danh sách UserTriggerDTO đã cập nhật
        return getUserTriggersByEmail(email);
    }
}
