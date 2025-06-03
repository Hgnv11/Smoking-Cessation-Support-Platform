package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.SmokingEventDTO;
import com.smokingcessation.model.SmokingEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface SmokingEventMapper {

    @Mapping(source = "mood", target = "mood", qualifiedByName = "moodToString")
    SmokingEventDTO toDto(SmokingEvent smokingEvent);

    @Mapping(source = "mood", target = "mood", qualifiedByName = "stringToMood")
    SmokingEvent toEntity(SmokingEventDTO smokingEventDTO);

    @Named("moodToString")
    default String moodToString(SmokingEvent.Mood mood) {
        return mood != null ? mood.name() : null;
    }

    @Named("stringToMood")
    default SmokingEvent.Mood stringToMood(String mood) {
        try {
            return mood != null ? SmokingEvent.Mood.valueOf(mood.toLowerCase()) : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}