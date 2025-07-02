package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.model.CommunityPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface PostMapper {

    PostDTO toDto(CommunityPost post);
    CommunityPost toEntity(PostDTO dto);
}
