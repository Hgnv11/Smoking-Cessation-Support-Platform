package com.smokingcessation.mapper;

import com.smokingcessation.model.UserSmokingProfile;
import com.smokingcessation.dto.UserSmokingProfileRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface UserSmokingProfileMapper {

    @Mapping(source = "user", target = "user")
    UserSmokingProfileRequest toDto(UserSmokingProfile entity);

    @Mapping(source = "user", target = "user")
    UserSmokingProfile toEntity(UserSmokingProfileRequest dto);
}
