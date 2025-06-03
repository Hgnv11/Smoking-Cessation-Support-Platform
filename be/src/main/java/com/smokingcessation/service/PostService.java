package com.smokingcessation.service;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.mapper.PostMapper;
import com.smokingcessation.model.CommunityPost;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.PostRepository;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    public PostDTO addNewPost(String userEmail, PostDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommunityPost post = new CommunityPost();
        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setPostType(request.getPostType());
        post.setIsApproved(false);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());


        CommunityPost savedPost = postRepository.save(post);
        return postMapper.toDto(savedPost);
    }

    public List<PostDTO> getMyPosts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<CommunityPost> posts = postRepository.findByUser(user);
        return posts.stream()
                .map(postMapper::toDto)
                .toList();
    }

    public List<PostDTO> getPostsByUserProfileName(String profileName) {
        User user = userRepository.findByProfileName(profileName)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<CommunityPost> posts = postRepository.findByUser(user);
        return posts.stream().map(postMapper::toDto).toList();
    }

    public PostDTO approvePost(int postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Cannot find post"));
        post.setIsApproved(true);
        post.setUpdatedAt(LocalDateTime.now());
        CommunityPost savedPost = postRepository.save(post);
        return postMapper.toDto(savedPost);
    }

    public void deletePost(int postId, String userEmail) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You do not have permission to delete this post");
        }
        postRepository.delete(post);
    }




}