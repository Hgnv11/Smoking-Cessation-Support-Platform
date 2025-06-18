package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.model.ReasonsQuit;
import com.smokingcessation.model.UserReasons;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReasonMapper {

    @Mapping(source = "reasonId", target = "reasonId")
    @Mapping(source = "reasonText", target = "reasonText")
    @Mapping(source = "isActive", target = "isActive")
    ReasonDTO toReasonDTO(ReasonsQuit reasonsQuit);

    @Mapping(source = "reason.reasonId", target = "reasonId")
    @Mapping(source = "reason.reasonText", target = "reasonText")
    @Mapping(source = "reason.isActive", target = "isActive")
    @Mapping(source = "user.userId", target = "userId")
    ReasonDTO toReasonDTO(UserReasons userReasons);

    @Mapping(target = "createdAt", ignore = true)
    ReasonsQuit toReasonsQuit(ReasonDTO reasonDTO);

    List<ReasonDTO> toReasonDTOList(List<ReasonsQuit> reasonsQuitList);

    List<ReasonDTO> toUserReasonDTOList(List<UserReasons> userReasonsList);
}