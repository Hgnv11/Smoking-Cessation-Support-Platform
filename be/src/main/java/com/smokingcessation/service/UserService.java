package com.smokingcessation.service;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                user.getProfileName()!=null?user.getProfileName(): user.getFullName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getAvatarUrl(),
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
            Optional<User> userWithProfileName = userRepository.findByProfileName(userDTO.getProfileName());
            if (!userWithProfileName.isPresent() || userWithProfileName.get().getUserId().equals(user.getUserId())) {
                user.setProfileName(userDTO.getProfileName());
            } else {
                throw new RuntimeException("ProfileName used");
            }
        }

        if (userDTO.getBirthDate() != null) {
            user.setBirthDate(userDTO.getBirthDate());
        }
        if (userDTO.getAvatarUrl() != null) {
            user.setAvatarUrl(userDTO.getAvatarUrl());
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
                user.getProfileName()!=null?user.getProfileName(): user.getFullName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getAvatarUrl(),
                user.getGender() != null ? user.getGender().name() : "OTHER"
        );
    }

    public UserDTO getUserById(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        return new UserDTO(
                user.getUserId(),
                user.getFullName(),
                user.getProfileName()!=null?user.getProfileName(): user.getFullName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getAvatarUrl(),
                user.getGender() != null ? user.getGender().name() : "OTHER"
        );
    }

    public UserDTO getUserByProfileName(String profileName) {
        User user = userRepository.findByProfileName(profileName)
                .orElseThrow(() -> new RuntimeException("User not found with profile name: " + profileName));
        return new UserDTO(
                user.getUserId(),
                user.getFullName(),
                user.getProfileName()!=null?user.getProfileName(): user.getFullName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getAvatarUrl(),
                user.getGender() != null ? user.getGender().name() : "OTHER"
        );
    }


    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = new ArrayList<>();

        for (User user : users) {
            UserDTO dto = new UserDTO();
            dto.setUserId(user.getUserId());
            dto.setFullName(user.getFullName());
            dto.setProfileName(user.getProfileName()!=null?user.getProfileName(): user.getFullName());
            dto.setEmail(user.getEmail());
            dto.setBirthDate(user.getBirthDate());
            dto.setGender(user.getGender() != null ? user.getGender().name() : "OTHER");
            userDTOs.add(dto);
        }

        return userDTOs;
    }

    public void softDeleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsDelete() != null && user.getIsDelete()) {
            throw new RuntimeException("User already deleted");
        }

        user.setIsDelete(true);
        userRepository.save(user);
    }

    public void updateUserRoleByUserId(Long userId, String newRoleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        User.Role newRole;
        try {
            newRole = User.Role.valueOf(newRoleStr.toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + newRoleStr);
        }

        user.setRole(newRole);
        userRepository.save(user);
    }



}
