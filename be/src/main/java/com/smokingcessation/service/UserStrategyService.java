package com.smokingcessation.service;

import com.smokingcessation.dto.res.UserStrategyDTO;
import com.smokingcessation.model.Strategy;
import com.smokingcessation.model.StrategyCategory;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserStrategy;
import com.smokingcessation.repository.StrategyRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.UserStrategyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserStrategyService {

    private final UserStrategyRepository userStrategyRepository;
    private final UserRepository userRepository;
    private final StrategyRepository strategyRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }

    private User getUserById(Integer userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại: " + userId));
    }

    public List<UserStrategyDTO> getUserStrategiesByUserId(Integer userId) {
        User user = getUserById(userId);

        List<UserStrategy> userStrategies = userStrategyRepository.findByUserUserId(userId);

        Map<StrategyCategory, List<Strategy>> strategiesByCategory = userStrategies.stream()
                .collect(Collectors.groupingBy(
                        us -> us.getStrategy().getCategory(),
                        Collectors.mapping(UserStrategy::getStrategy, Collectors.toList())
                ));

        List<StrategyCategory> strategyCategories = strategiesByCategory.entrySet().stream()
                .map(entry -> StrategyCategory.builder()
                        .categoryId(entry.getKey().getCategoryId())
                        .name(entry.getKey().getName())
                        .description(entry.getKey().getDescription())
                        .strategies(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        UserStrategyDTO dto = UserStrategyDTO.builder()
                .userId(userId)
                .strategyCategories(strategyCategories)
                .build();

        return List.of(dto);
    }


    public List<UserStrategyDTO> getUserStrategiesByEmail(String email) {
        User user = getUserByEmail(email);
        Integer userId = user.getUserId();

        List<UserStrategy> userStrategies = userStrategyRepository.findByUserUserId(userId);

        Map<StrategyCategory, List<Strategy>> strategiesByCategory = userStrategies.stream()
                .collect(Collectors.groupingBy(
                        us -> us.getStrategy().getCategory(),
                        Collectors.mapping(UserStrategy::getStrategy, Collectors.toList())
                ));

        List<StrategyCategory> strategyCategories = strategiesByCategory.entrySet().stream()
                .map(entry -> StrategyCategory.builder()
                        .categoryId(entry.getKey().getCategoryId())
                        .name(entry.getKey().getName())
                        .description(entry.getKey().getDescription())
                        .strategies(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        UserStrategyDTO dto = UserStrategyDTO.builder()
                .userId(userId)
                .strategyCategories(strategyCategories)
                .build();

        return List.of(dto);
    }

    @Transactional
    public List<UserStrategyDTO> createMultipleUserStrategiesByEmail(String email, List<Integer> strategyIds) {
        User user = getUserByEmail(email);
        Integer userId = user.getUserId();

        LocalDateTime now = LocalDateTime.now();
        for (Integer strategyId : strategyIds) {
            if (userStrategyRepository.existsByUserUserIdAndStrategyStrategyId(userId, strategyId)) continue;

            Strategy strategy = strategyRepository.findById(strategyId)
                    .orElseThrow(() -> new RuntimeException("Chiến lược không tồn tại: " + strategyId));

            UserStrategy userStrategy = UserStrategy.builder()
                    .user(user)
                    .strategy(strategy)
                    .createdAt(now)
                    .build();

            userStrategyRepository.save(userStrategy);
        }

        return getUserStrategiesByEmail(email);
    }

    @Transactional
    public List<UserStrategyDTO> syncUserStrategiesByEmail(String email, List<Integer> selectedStrategyIds) {
        User user = getUserByEmail(email);
        Integer userId = user.getUserId();

        // Lấy danh sách strategyId hiện tại của người dùng
        List<UserStrategy> existingStrategies = userStrategyRepository.findByUserUserId(userId);
        Set<Integer> existingStrategyIds = existingStrategies.stream()
                .map(us -> us.getStrategy().getStrategyId())
                .collect(Collectors.toSet());

        // Lấy danh sách strategyId được chọn từ client
        Set<Integer> selectedStrategyIdSet = Set.copyOf(selectedStrategyIds);

        // Xác định các strategyId cần thêm (có trong selected nhưng không có trong existing)
        List<Integer> strategiesToAdd = selectedStrategyIds.stream()
                .filter(id -> !existingStrategyIds.contains(id))
                .toList();

        // Xác định các strategyId cần xóa (có trong existing nhưng không có trong selected)
        List<Integer> strategiesToRemove = existingStrategyIds.stream()
                .filter(id -> !selectedStrategyIdSet.contains(id))
                .toList();

        // Thêm các UserStrategy mới
        LocalDateTime now = LocalDateTime.now();
        for (Integer strategyId : strategiesToAdd) {
            Strategy strategy = strategyRepository.findById(strategyId)
                    .orElseThrow(() -> new RuntimeException("Chiến lược không tồn tại: " + strategyId));

            UserStrategy userStrategy = UserStrategy.builder()
                    .user(user)
                    .strategy(strategy)
                    .createdAt(now)
                    .build();

            userStrategyRepository.save(userStrategy);
        }

        // Xóa các UserStrategy không còn được chọn
        for (Integer strategyId : strategiesToRemove) {
            userStrategyRepository.deleteByUserUserIdAndStrategyStrategyId(userId, strategyId);
        }

        // Trả về danh sách UserStrategyDTO đã cập nhật
        return getUserStrategiesByEmail(email);
    }
}