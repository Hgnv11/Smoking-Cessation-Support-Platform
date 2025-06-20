package com.smokingcessation.service;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.mapper.UserMapper;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;


//     Lấy profile của user dựa trên email
    public UserDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));
        return userMapper.toDto(user);
    }

//     Cập nhật profile của user dựa trên email
    public UserDTO updateUserByEmail(String email, UserDTO userDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (userDTO.getFullName() != null) {
            user.setFullName(userDTO.getFullName());
        }
        if (userDTO.getProfileName() != null) {
            User existingUser = userRepository.findByProfileName(userDTO.getProfileName()).orElse(null);
            if (existingUser == null || existingUser.getUserId().equals(user.getUserId())) {
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
        return userMapper.toDto(user);
    }

//     Lấy thông tin user dựa trên userId
    public UserDTO getUserById(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));
        return userMapper.toDto(user);
    }

//     Lấy thông tin user dựa trên profileName
    public UserDTO getUserByProfileName(String profileName) {
        User user = userRepository.findByProfileName(profileName)
                .orElseThrow(() -> new RuntimeException("User not found with profile name: " + profileName));
        return userMapper.toDto(user);
    }

//     Lấy danh sách tất cả user
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

//     Xóa mềm user dựa trên email
    public void softDeleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (Boolean.TRUE.equals(user.getIsDelete())) {
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

    public List<User> getAllMentors() {
        return userRepository.findAll().stream()
                .filter(user -> "mentor".equals(user.getRole().name()))
                .toList();
    }

    public List<UserDTO> getAllMentorsForUser() {
        return userRepository.findAll().stream()
                .filter(user -> "mentor".equals(user.getRole().name()))
                .map(userMapper::toDto)
                .toList();
    }
}