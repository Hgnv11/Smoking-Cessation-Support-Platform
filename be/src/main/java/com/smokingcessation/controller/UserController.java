package com.smokingcessation.controller;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDTO> getProfile(Principal principal) {
        String email = principal.getName(); // Lấy email từ token
        UserDTO profile = userService.getProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    @PostMapping
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO, Principal principal) {
        String email = principal.getName(); // Lấy email từ token
        UserDTO updatedProfile = userService.updateUserByEmail(email, userDTO);
        return ResponseEntity.ok(updatedProfile);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> viewOtherUserProfile(@PathVariable Integer userId) {
        UserDTO userDTO = userService.getUserById(userId);
        return ResponseEntity.ok(userDTO);
    }
}
