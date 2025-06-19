package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.PostDTO;
import com.smokingcessation.model.CommunityPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface PostMapper {

    @Mapping(source = "user", target = "user")
    @Mapping(source = "isApproved", target = "isApproved")
    PostDTO toDto(CommunityPost post);


    @Mapping(target = "user", ignore = true)
    CommunityPost toEntity(PostDTO dto);
}
