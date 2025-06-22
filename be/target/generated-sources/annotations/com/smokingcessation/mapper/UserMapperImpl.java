package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-22T21:13:53+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        if ( user.getUserId() != null ) {
            userDTO.userId( user.getUserId() );
        }
        userDTO.fullName( user.getFullName() );
        userDTO.profileName( user.getProfileName() );
        userDTO.email( user.getEmail() );
        userDTO.birthDate( user.getBirthDate() );
        userDTO.avatarUrl( user.getAvatarUrl() );
        if ( user.getGender() != null ) {
            userDTO.gender( user.getGender().name() );
        }

        return userDTO.build();
    }

    @Override
    public User toEntity(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        User user = new User();

        user.setUserId( userDTO.getUserId() );
        user.setEmail( userDTO.getEmail() );
        user.setProfileName( userDTO.getProfileName() );
        user.setFullName( userDTO.getFullName() );
        user.setAvatarUrl( userDTO.getAvatarUrl() );
        user.setBirthDate( userDTO.getBirthDate() );
        if ( userDTO.getGender() != null ) {
            user.setGender( Enum.valueOf( User.Gender.class, userDTO.getGender() ) );
        }

        return user;
    }
}
