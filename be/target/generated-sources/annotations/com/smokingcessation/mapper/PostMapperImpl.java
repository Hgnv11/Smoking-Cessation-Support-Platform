package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.model.CommunityPost;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-14T21:46:32+0700",
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

        postDTO.setPostId( post.getPostId() );
        postDTO.setUser( userMapper.toDto( post.getUser() ) );
        postDTO.setTitle( post.getTitle() );
        postDTO.setContent( post.getContent() );
        postDTO.setImageUrl( post.getImageUrl() );
        postDTO.setPostType( post.getPostType() );
        postDTO.setUpdatedAt( post.getUpdatedAt() );
        postDTO.setIsApproved( post.getIsApproved() );

        return postDTO;
    }

    @Override
    public CommunityPost toEntity(PostDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CommunityPost communityPost = new CommunityPost();

        communityPost.setPostId( dto.getPostId() );
        communityPost.setUser( userMapper.toEntity( dto.getUser() ) );
        communityPost.setTitle( dto.getTitle() );
        communityPost.setContent( dto.getContent() );
        communityPost.setPostType( dto.getPostType() );
        communityPost.setIsApproved( dto.getIsApproved() );
        communityPost.setImageUrl( dto.getImageUrl() );
        communityPost.setUpdatedAt( dto.getUpdatedAt() );

        return communityPost;
    }
}
