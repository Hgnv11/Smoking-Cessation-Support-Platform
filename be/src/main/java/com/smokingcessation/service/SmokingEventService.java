package com.smokingcessation.service;

import com.smokingcessation.dto.res.SavingDTO;
import com.smokingcessation.dto.res.SmokingEventDTO;
import com.smokingcessation.mapper.SmokingEventMapper;
import com.smokingcessation.model.SmokingEvent;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserSmokingProfile;
import com.smokingcessation.repository.SmokingEventRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.UserSmokingProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SmokingEventService {

    private final UserRepository userRepository;
    private final SmokingEventRepository smokingEventRepository;
    private final SmokingEventMapper smokingEventMapper;
    private final UserSmokingProfileRepository userSmokingProfileRepository;


    public SmokingEventDTO addNewSmokingEvent(String userEmail, SmokingEventDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getCigarettesSmoked() == null) {
            throw new RuntimeException("Cigarettes smoked cannot be null");
        }
        if (request.getCravingLevel() != null &&
                (request.getCravingLevel() < 0 || request.getCravingLevel() > 10)) {
            throw new RuntimeException("Craving level must be between 0 and 10");
        }

        SmokingEvent smokingEvent = smokingEventMapper.toEntity(request);
        smokingEvent.setUser(user);
        smokingEvent.setEventTime(LocalDateTime.now());

        SmokingEvent savedEvent = smokingEventRepository.save(smokingEvent);
        return smokingEventMapper.toDto(savedEvent);
    }

    public List<SmokingEventDTO> getMySmokingEvents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<SmokingEvent> events = smokingEventRepository.findByUser(user);
        return events.stream()
                .map(smokingEventMapper::toDto)
                .toList();
    }

    public SmokingEventDTO updateSmokingEvent(int eventId, String userEmail, SmokingEventDTO request) {
        SmokingEvent smokingEvent = smokingEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Smoking event not found"));

        if (!smokingEvent.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You do not have permission to update this smoking event");
        }
        if (request.getCigarettesSmoked() == null) {
            throw new RuntimeException("Cigarettes smoked cannot be null");
        }
        if (request.getCravingLevel() != null &&
                (request.getCravingLevel() < 0 || request.getCravingLevel() > 10)) {
            throw new RuntimeException("Craving level must be between 0 and 10");
        }
        smokingEvent.setCigarettesSmoked(request.getCigarettesSmoked());
        smokingEvent.setCravingLevel(request.getCravingLevel());
        smokingEvent.setNotes(request.getNotes());
        smokingEvent.setEventTime(request.getEventTime() != null ? request.getEventTime() : LocalDateTime.now());

        SmokingEvent updatedEvent = smokingEventRepository.save(smokingEvent);
        return smokingEventMapper.toDto(updatedEvent);
    }

    public void deleteSmokingEvent(int eventId, String userEmail) {
        SmokingEvent smokingEvent = smokingEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Smoking event not found"));
        if (!smokingEvent.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You do not have permission to delete this smoking event");
        }
        smokingEventRepository.delete(smokingEvent);
    }
}
