package com.smokingcessation.controller;

import com.smokingcessation.dto.res.MentorWithRatingDTO;
import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.model.User;
import com.smokingcessation.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "lấy profile user "
    )
    @GetMapping("/my")
    public ResponseEntity<UserDTO> getProfile(Principal principal) {
        String email = principal.getName(); // Lấy email từ token
        System.out.println(email);
        UserDTO profile = userService.getProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "Lấy danh sách tất cả mentor cho user thực hiện"
    )
    @GetMapping("/mentors")
    public ResponseEntity<List<MentorWithRatingDTO>> getAllMentors() {
        List<MentorWithRatingDTO> mentors = userService.getAllMentorsForUser();
        return ResponseEntity.ok(mentors);
    }

    @Operation(summary = "Lấy thông tin một mentor cụ thể kèm theo rating trung bình")
    @GetMapping("/mentors/{profileNameMentor}")
    public ResponseEntity<MentorWithRatingDTO> getMentorById(@PathVariable String profileNameMentor) {
        MentorWithRatingDTO mentor = userService.getMentorByIdForUser(profileNameMentor);
        return ResponseEntity.ok(mentor);
    }


    @Operation(
            summary = "Update profile user "
    )
    @PostMapping("/my")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO, Principal principal) {
        String email = principal.getName(); // Lấy email từ token
        UserDTO updatedProfile = userService.updateUserByEmail(email, userDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @Operation(
            summary = "xem infor của user khác truyền váo othe profilename user"
    )
    @GetMapping("/by-name/{profileName}")
    public ResponseEntity<UserDTO> viewUserByProfileName(@PathVariable String profileName) {
        UserDTO userDTO = userService.getUserByProfileName(profileName);
        return ResponseEntity.ok(userDTO);
    }

    @Operation(
            summary = "set status user is_delete "
    )
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteUser(Principal principal) {
        String email = principal.getName();
        userService.softDeleteUser(email);
        return ResponseEntity.ok("User deleted successfully");
    }
}
