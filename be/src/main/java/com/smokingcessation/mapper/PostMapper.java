package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.model.CommunityPost;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostDTO toDto(CommunityPost post);
}
