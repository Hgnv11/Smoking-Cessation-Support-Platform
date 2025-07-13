package com.smokingcessation.service;

import com.smokingcessation.model.Trigger;
import com.smokingcessation.model.TriggerCategory;
import com.smokingcessation.repository.TriggerRepository;
import com.smokingcessation.repository.TriggerCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TriggerService {

    private final TriggerRepository triggerRepository;
    private final TriggerCategoryRepository categoryRepository;

    // ====== TRIGGER CATEGORY CRUD ======

    public List<TriggerCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public TriggerCategory createCategory(String nameCategory) {
        TriggerCategory category = new TriggerCategory();
        category.setName(nameCategory);
        return categoryRepository.save(category);
    }

    public TriggerCategory updateCategory(Integer id, String name) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(name);
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

    // ====== TRIGGER CRUD ======

    public Optional<Trigger> getTriggerById(Integer id) {
        return triggerRepository.findById(id);
    }

    public Trigger createTrigger(String name, Integer categoryId) {
        TriggerCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        Trigger trigger = Trigger.builder()
                .name(name)
                .category(category)
                .build();

        return triggerRepository.save(trigger);
    }

    public Trigger updateTrigger(Integer id, String name, Integer categoryId) {
        TriggerCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        return triggerRepository.findById(id)
                .map(trigger -> {
                    trigger.setName(name);
                    trigger.setCategory(category);
                    return triggerRepository.save(trigger);
                })
                .orElseThrow(() -> new RuntimeException("Trigger không tồn tại"));
    }

    public void deleteTrigger(Integer id) {
        if (!triggerRepository.existsById(id)) {
            throw new RuntimeException("Trigger không tồn tại");
        }
        triggerRepository.deleteById(id);
    }

    // ====== Get Triggers by Category ID ======

    public List<Trigger> getTriggersByCategoryId(Integer categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new RuntimeException("Danh mục không tồn tại");
        }
        return triggerRepository.findByCategoryCategoryId(categoryId);
    }
}