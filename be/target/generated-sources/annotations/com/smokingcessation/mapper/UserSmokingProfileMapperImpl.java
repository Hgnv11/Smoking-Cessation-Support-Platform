package com.smokingcessation.mapper;

import com.smokingcessation.dto.UserSmokingProfileRequest;
import com.smokingcessation.model.UserSmokingProfile;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-14T21:46:32+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class UserSmokingProfileMapperImpl implements UserSmokingProfileMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserSmokingProfileRequest toDto(UserSmokingProfile entity) {
        if ( entity == null ) {
            return null;
        }

        UserSmokingProfileRequest userSmokingProfileRequest = new UserSmokingProfileRequest();

        userSmokingProfileRequest.setUser( userMapper.toDto( entity.getUser() ) );
        userSmokingProfileRequest.setProfileId( entity.getProfileId() );
        userSmokingProfileRequest.setCigarettesPerDay( entity.getCigarettesPerDay() );
        userSmokingProfileRequest.setCigarettesPerPack( entity.getCigarettesPerPack() );
        userSmokingProfileRequest.setCigarettePackCost( entity.getCigarettePackCost() );
        userSmokingProfileRequest.setQuitDate( entity.getQuitDate() );
        userSmokingProfileRequest.setEndDate( entity.getEndDate() );
        userSmokingProfileRequest.setStatus( entity.getStatus() );

        return userSmokingProfileRequest;
    }

    @Override
    public UserSmokingProfile toEntity(UserSmokingProfileRequest dto) {
        if ( dto == null ) {
            return null;
        }

        UserSmokingProfile userSmokingProfile = new UserSmokingProfile();

        userSmokingProfile.setUser( userMapper.toEntity( dto.getUser() ) );
        userSmokingProfile.setProfileId( dto.getProfileId() );
        userSmokingProfile.setCigarettesPerDay( dto.getCigarettesPerDay() );
        userSmokingProfile.setCigarettesPerPack( dto.getCigarettesPerPack() );
        userSmokingProfile.setCigarettePackCost( dto.getCigarettePackCost() );
        userSmokingProfile.setQuitDate( dto.getQuitDate() );
        userSmokingProfile.setEndDate( dto.getEndDate() );
        userSmokingProfile.setStatus( dto.getStatus() );

        return userSmokingProfile;
    }
}
