package com.smokingcessation.service;

import com.smokingcessation.dto.UserSmokingProfileRequest;
import com.smokingcessation.mapper.UserSmokingProfileMapper;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserSmokingProfile;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.UserSmokingProfileRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserSmokingProfileService {

    private final UserRepository userRepository;
    private final UserSmokingProfileRepository userSmokingProfileRepository;
    private final UserSmokingProfileMapper mapper;
    public UserSmokingProfileService(UserRepository userRepository, UserSmokingProfileRepository userSmokingProfileRepository, UserSmokingProfileMapper mapper) {
        this.userRepository = userRepository;
        this.userSmokingProfileRepository = userSmokingProfileRepository;
        this.mapper = mapper;
    }

    public UserSmokingProfileRequest getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return mapper.toDto(userSmokingProfileRepository.findByUser(user).orElse(null));

    }

    public UserSmokingProfileRequest AddOrUpdateProfileByEmail(String email, UserSmokingProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        UserSmokingProfile profile = userSmokingProfileRepository.findByUser(user)
                .orElse(null);

        if (profile == null) {
            profile = new UserSmokingProfile();
            profile.setUser(user);
        }

        // form cho enum
        UserSmokingProfile.SmokingStatus smokingStatusEnum = UserSmokingProfile.SmokingStatus.valueOf(request.getSmokingStatus().toLowerCase());
        UserSmokingProfile.MotivationLevel motivationLevelEnum = UserSmokingProfile.MotivationLevel.valueOf(request.getMotivationLevel().toLowerCase());
        // Cập nhật các trường từ request

        profile.setSmokingStatus(smokingStatusEnum);
        profile.setCigarettesPerDay(request.getCigarettesPerDay());
        profile.setYearsSmoking(request.getYearsSmoking());
        profile.setCigaretteCost(request.getCigaretteCost());
        profile.setQuitDate(request.getQuitDate());
        profile.setMotivationLevel(motivationLevelEnum);
        profile.setHealthConcerns(request.getHealthConcerns());
        profile.setUpdatedAt(LocalDateTime.now());

        UserSmokingProfile savedProfile = userSmokingProfileRepository.save(profile);
        return mapper.toDto(savedProfile);
    }

}
