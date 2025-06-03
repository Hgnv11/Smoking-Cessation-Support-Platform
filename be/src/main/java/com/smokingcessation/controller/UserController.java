package com.smokingcessation.controller;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/my")
    public ResponseEntity<UserDTO> getProfile(Principal principal) {
        String email = principal.getName(); // Lấy email từ token
        System.out.println(email);
        UserDTO profile = userService.getProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/my")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO, Principal principal) {
        String email = principal.getName(); // Lấy email từ token
        UserDTO updatedProfile = userService.updateUserByEmail(email, userDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/by-name/{profileName}")
    public ResponseEntity<UserDTO> viewUserByProfileName(@PathVariable String profileName) {
        UserDTO userDTO = userService.getUserByProfileName(profileName);
        return ResponseEntity.ok(userDTO);
    }
    @GetMapping()
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
