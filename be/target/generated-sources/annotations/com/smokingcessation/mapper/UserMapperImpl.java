package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserDTO;
import com.smokingcessation.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-02T15:45:32+0700",
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
        userDTO.isVerified( user.getIsVerified() );
        userDTO.birthDate( user.getBirthDate() );
        userDTO.avatarUrl( user.getAvatarUrl() );
        if ( user.getGender() != null ) {
            userDTO.gender( user.getGender().name() );
        }
        userDTO.note( user.getNote() );

        return userDTO.build();
    }

    @Override
    public User toEntity(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.userId( userDTO.getUserId() );
        user.email( userDTO.getEmail() );
        user.profileName( userDTO.getProfileName() );
        user.fullName( userDTO.getFullName() );
        user.avatarUrl( userDTO.getAvatarUrl() );
        user.birthDate( userDTO.getBirthDate() );
        if ( userDTO.getGender() != null ) {
            user.gender( Enum.valueOf( User.Gender.class, userDTO.getGender() ) );
        }
        user.note( userDTO.getNote() );
        user.isVerified( userDTO.getIsVerified() );

        return user.build();
    }
}
