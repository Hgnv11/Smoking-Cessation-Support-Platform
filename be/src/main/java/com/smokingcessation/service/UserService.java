package com.smokingcessation.service;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.mapper.UserMapper;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    // Get profile by email
    public UserDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));
        return userMapper.toDto(user);
    }

    // Update profile by email (for user)
    public UserDTO updateUserByEmail(String email, UserDTO userDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (userDTO.getFullName() != null) user.setFullName(userDTO.getFullName());

        if (userDTO.getProfileName() != null) {
            User existingUser = userRepository.findByProfileName(userDTO.getProfileName()).orElse(null);
            if (existingUser == null || existingUser.getUserId().equals(user.getUserId())) {
                user.setProfileName(userDTO.getProfileName());
            } else {
                throw new RuntimeException("ProfileName used");
            }
        }

        if (userDTO.getBirthDate() != null) user.setBirthDate(userDTO.getBirthDate());
        if (userDTO.getAvatarUrl() != null) user.setAvatarUrl(userDTO.getAvatarUrl());

        if (userDTO.getGender() != null) {
            try {
                user.setGender(User.Gender.valueOf(userDTO.getGender().toLowerCase()));
            } catch (IllegalArgumentException e) {
                user.setGender(User.Gender.other);
            }
        }

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    // Get UserDTO by ID
    public UserDTO getUserById(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));
        return userMapper.toDto(user);
    }

    // Get UserDTO by profile name
    public UserDTO getUserByProfileName(String profileName) {
        User user = userRepository.findByProfileName(profileName)
                .orElseThrow(() -> new RuntimeException("User not found with profile name: " + profileName));
        return userMapper.toDto(user);
    }

    // Get full User entity by ID (for admin)
    public User findUserEntityById(Integer userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));
    }

    // Get all users (for admin)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get mentors (entity)
    public List<User> getAllMentors() {
        return userRepository.findAll().stream()
                .filter(user -> "mentor".equals(user.getRole().name()))
                .toList();
    }

    // Get mentors (DTO for user)
    public List<UserDTO> getAllMentorsForUser() {
        return userRepository.findAll().stream()
                .filter(user -> "mentor".equals(user.getRole().name()))
                .map(userMapper::toDto)
                .toList();
    }

    // Admin update: full quyền chỉnh user (trừ email, password)
    public User updateUserEntity(Integer userId, User updatedInfo) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedInfo.getFullName() != null) user.setFullName(updatedInfo.getFullName());

        if (updatedInfo.getProfileName() != null && !updatedInfo.getProfileName().equals(user.getProfileName())) {
            Optional<User> existing = userRepository.findByProfileName(updatedInfo.getProfileName());
            if (existing.isEmpty() || existing.get().getUserId().equals(user.getUserId())) {
                user.setProfileName(updatedInfo.getProfileName());
            } else {
                throw new RuntimeException("Profile name already in use");
            }
        }

        if (updatedInfo.getAvatarUrl() != null) user.setAvatarUrl(updatedInfo.getAvatarUrl());
        if (updatedInfo.getBirthDate() != null) user.setBirthDate(updatedInfo.getBirthDate());
        if (updatedInfo.getGender() != null) user.setGender(updatedInfo.getGender());

        // Trạng thái
        if (updatedInfo.getIsDelete() != null) user.setIsDelete(updatedInfo.getIsDelete());
        if (updatedInfo.getIsBlock() != null) user.setIsBlock(updatedInfo.getIsBlock());
        if (updatedInfo.getHasActive() != null) user.setHasActive(updatedInfo.getHasActive());
        if (updatedInfo.getIsVerified() != null) user.setIsVerified(updatedInfo.getIsVerified());

        if (updatedInfo.getRole() != null) user.setRole(updatedInfo.getRole());
        if (updatedInfo.getTypeLogin() != null) user.setTypeLogin(updatedInfo.getTypeLogin());

        return userRepository.save(user);
    }

    // Admin soft delete by ID
    public void softDeleteUserById(Integer userId) {
        User user = findUserEntityById(userId);
        if (Boolean.TRUE.equals(user.getIsDelete())) {
            throw new RuntimeException("User already deleted");
        }
        user.setIsDelete(true);
        userRepository.save(user);
    }

    // Update role by userId (string input)
    public void updateUserRoleByUserId(Long userId, String newRoleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        try {
            user.setRole(User.Role.valueOf(newRoleStr.toLowerCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + newRoleStr);
        }
        userRepository.save(user);
    }

    // Save user (for admin create)
    public User saveUser(User newUser) {

        if (newUser.getEmail() == null || newUser.getPasswordHash() == null) {
            throw new RuntimeException("Email and password are required");
        }

        // Hash password
        String hashedPassword = passwordEncoder.encode(newUser.getPasswordHash());
        newUser.setPasswordHash(hashedPassword);

        // Mặc định role là guest nếu chưa chọn
        if (newUser.getRole() == null) {
            newUser.setRole(User.Role.guest);
        }

        return userRepository.save(newUser);
    }


    // Soft delete by email (for user case)
    public void softDeleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (Boolean.TRUE.equals(user.getIsDelete())) {
            throw new RuntimeException("User already deleted");
        }
        user.setIsDelete(true);
        userRepository.save(user);
    }
}
