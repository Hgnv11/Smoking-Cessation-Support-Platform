package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserStrategyDTO;
import com.smokingcessation.model.UserStrategy;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T21:30:16+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class UserStrategyMapperImpl implements UserStrategyMapper {

    @Override
    public UserStrategyDTO toDto(UserStrategy userStrategy) {
        if ( userStrategy == null ) {
            return null;
        }

        UserStrategyDTO.UserStrategyDTOBuilder userStrategyDTO = UserStrategyDTO.builder();

        return userStrategyDTO.build();
    }

    @Override
    public UserStrategy toEntity(UserStrategyDTO userStrategyDTO) {
        if ( userStrategyDTO == null ) {
            return null;
        }

        UserStrategy.UserStrategyBuilder userStrategy = UserStrategy.builder();

        return userStrategy.build();
    }
}
