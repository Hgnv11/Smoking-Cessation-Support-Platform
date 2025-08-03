package com.smokingcessation.service;

import com.smokingcessation.model.SupportMeasure;
import com.smokingcessation.repository.SupportMeasureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportMeasureService {

    private final SupportMeasureRepository repository;

    public List<SupportMeasure> getAll() {
        return repository.findAll();
    }

    public SupportMeasure getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public SupportMeasure create(SupportMeasure supportMeasure) {
        return repository.save(supportMeasure);
    }

    public SupportMeasure update(Integer id, SupportMeasure updateData) {
        SupportMeasure existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        existing.setSupportMeasures(updateData.getSupportMeasures());
        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
