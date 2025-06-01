package com.smokingcessation.service;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));

        return new UserDTO(
                user.getUserId(),
                user.getFullName(),
                user.getProfileName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getGender() != null ? user.getGender().name() : "OTHER"
        );
    }
    public UserDTO updateUserByEmail(String email, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (!optionalUser.isPresent()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        User user = optionalUser.get();

        if (userDTO.getFullName() != null) {
            user.setFullName(userDTO.getFullName());
        }
        if (userDTO.getProfileName() != null) {
            user.setProfileName(userDTO.getProfileName());
        }

        if (userDTO.getBirthDate() != null) {
            user.setBirthDate(userDTO.getBirthDate());
        }
        if (userDTO.getGender() != null) {
            try {
                User.Gender genderEnum = User.Gender.valueOf(userDTO.getGender().toLowerCase());
                user.setGender(genderEnum);
            } catch (IllegalArgumentException e) {
                user.setGender(User.Gender.other);
            }
        }

        userRepository.save(user);

        return new UserDTO(
                user.getUserId(),
                user.getFullName(),
                user.getProfileName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getGender() != null ? user.getGender().name() : "OTHER"
        );
    }

    public UserDTO getUserById(int userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        return new UserDTO(
                user.getUserId(),
                user.getFullName(),
                user.getProfileName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getGender() != null ? user.getGender().name() : "OTHER"
        );
    }


}
