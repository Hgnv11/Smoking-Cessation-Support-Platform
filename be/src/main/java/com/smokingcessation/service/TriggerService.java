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

    public TriggerCategory createCategory(TriggerCategory category) {
        return categoryRepository.save(category);
    }

    public TriggerCategory updateCategory(Integer id, TriggerCategory updatedCategory) {
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

    // ====== TRIGGER CRUD ======

    public List<Trigger> getAllTriggers() {
        return triggerRepository.findAll();
    }

    public Optional<Trigger> getTriggerById(Integer id) {
        return triggerRepository.findById(id);
    }

    public Trigger createTrigger(String name, String description, Integer categoryId) {
        TriggerCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        Trigger trigger = Trigger.builder()
                .name(name)
                .description(description)
                .category(category)
                .build();

        return triggerRepository.save(trigger);
    }

    public Trigger updateTrigger(Integer id, String name, String description, Integer categoryId) {
        TriggerCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        return triggerRepository.findById(id)
                .map(trigger -> {
                    trigger.setName(name);
                    trigger.setDescription(description);
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
}