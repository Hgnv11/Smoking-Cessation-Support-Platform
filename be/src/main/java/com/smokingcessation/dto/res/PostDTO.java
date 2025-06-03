

package com.smokingcessation.dto.res;

import com.smokingcessation.model.CommunityPost.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostDTO {

    private Integer postId;
    private UserDTO user;
    @NotBlank
    private String title;
;
    @NotBlank
    private String content;

    @NotNull
    private PostType postType;
}