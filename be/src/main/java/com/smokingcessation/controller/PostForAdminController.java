package com.smokingcessation.controller;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@Validated
@RestController
@RequestMapping("/api/post/admin")
@RequiredArgsConstructor
public class PostForAdminController {
    private final PostService postService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PostDTO> addNewPostForAdmin(
            Principal principal,
            @RequestBody PostDTO request) {
        String email = principal.getName();
        PostDTO createdPost = postService.addNewPostForAdmin(email, request);
        return ResponseEntity.ok(createdPost);
    }

}
