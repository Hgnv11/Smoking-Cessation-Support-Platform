package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDto(User user);

    User toEntity(UserDTO userDTO);
}