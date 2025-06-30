package com.smokingcessation.service;

import com.smokingcessation.model.Strategy;
import com.smokingcessation.model.StrategyCategory;
import com.smokingcessation.repository.StrategyCategoryRepository;
import com.smokingcessation.repository.StrategyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StrategyService {

    private final StrategyRepository strategyRepository;
    private final StrategyCategoryRepository categoryRepository;

    // ====== STRATEGY CATEGORY CRUD ======

    public List<StrategyCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public StrategyCategory createCategory(StrategyCategory category) {
        return categoryRepository.save(category);
    }

    public StrategyCategory updateCategory(Integer id, StrategyCategory updatedCategory) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(updatedCategory.getName());
                    category.setDescription(updatedCategory.getDescription());
                    return categoryRepository.save(category);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
    }

    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Danh mục không tồn tại");
        }
        categoryRepository.deleteById(id);
    }

    // ====== STRATEGY CRUD ======

    public Optional<Strategy> getStrategyById(Integer id) {
        return strategyRepository.findById(id);
    }

    public Strategy createStrategy(String name, String description, Integer categoryId) {
        StrategyCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        Strategy strategy = Strategy.builder()
                .name(name)
                .description(description)
                .category(category)
                .build();

        return strategyRepository.save(strategy);
    }

    public Strategy updateStrategy(Integer id, String name, String description, Integer categoryId) {
        StrategyCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        return strategyRepository.findById(id)
                .map(strategy -> {
                    strategy.setName(name);
                    strategy.setDescription(description);
                    strategy.setCategory(category);
                    return strategyRepository.save(strategy);
                })
                .orElseThrow(() -> new RuntimeException("Chiến lược không tồn tại"));
    }

    public void deleteStrategy(Integer id) {
        if (!strategyRepository.existsById(id)) {
            throw new RuntimeException("Chiến lược không tồn tại");
        }
        strategyRepository.deleteById(id);
    }

    // ====== Get Strategies by Category ID ======

    public List<Strategy> getStrategiesByCategoryId(Integer categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new RuntimeException("Danh mục không tồn tại");
        }
        return strategyRepository.findByCategoryCategoryId(categoryId);
    }
}