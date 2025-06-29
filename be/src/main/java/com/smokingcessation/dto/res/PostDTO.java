

package com.smokingcessation.dto.res;

import com.smokingcessation.model.CommunityPost.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PostDTO {

    private Integer postId;
    private UserDTO user;
    @NotBlank
    private String title;

    @NotBlank
    private String content;
    private String imageUrl;

    @NotNull
    private PostType postType;
    private LocalDateTime updatedAt;
    private Boolean isApproved;



}