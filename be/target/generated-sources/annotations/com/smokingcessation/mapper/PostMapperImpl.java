package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.model.CommunityPost;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-22T21:13:53+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public PostDTO toDto(CommunityPost post) {
        if ( post == null ) {
            return null;
        }

        PostDTO postDTO = new PostDTO();

        postDTO.setUser( userMapper.toDto( post.getUser() ) );
        postDTO.setIsApproved( post.getIsApproved() );
        postDTO.setPostId( post.getPostId() );
        postDTO.setTitle( post.getTitle() );
        postDTO.setContent( post.getContent() );
        postDTO.setImageUrl( post.getImageUrl() );
        postDTO.setPostType( post.getPostType() );

        return postDTO;
    }

    @Override
    public CommunityPost toEntity(PostDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CommunityPost communityPost = new CommunityPost();

        communityPost.setPostId( dto.getPostId() );
        communityPost.setTitle( dto.getTitle() );
        communityPost.setContent( dto.getContent() );
        communityPost.setPostType( dto.getPostType() );
        communityPost.setIsApproved( dto.getIsApproved() );
        communityPost.setImageUrl( dto.getImageUrl() );

        return communityPost;
    }
}
