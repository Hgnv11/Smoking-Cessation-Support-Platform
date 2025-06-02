package com.smokingcessation.mapper;

import com.smokingcessation.model.UserSmokingProfile;
import com.smokingcessation.dto.UserSmokingProfileRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserSmokingProfileMapper {



    UserSmokingProfileRequest toDto(UserSmokingProfile profile);

    UserSmokingProfile toEntity(UserSmokingProfileRequest dto);
}
