package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.UserStrategyDTO;
import com.smokingcessation.model.UserStrategy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserStrategyMapper {
    UserStrategyDTO toDto(UserStrategy userStrategy);
    UserStrategy toEntity(UserStrategyDTO userStrategyDTO);
}