package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.BadgeDTO;
import com.smokingcessation.dto.res.ProgressMilestoneDTO;
import com.smokingcessation.model.ProgressMilestone;
import com.smokingcessation.model.UserBadge;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AchievementMapper {

    @Mapping(source = "milestoneId", target = "milestoneId")
    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "milestoneType", target = "milestoneType")
    @Mapping(source = "achievedDate", target = "achievedDate")
    @Mapping(source = "rewardPoints", target = "rewardPoints")
    ProgressMilestoneDTO toMilestoneDto(ProgressMilestone milestone);

    @Mapping(source = "badge.badgeId", target = "badgeId")
    @Mapping(source = "badgeType", target = "badgeType")
    @Mapping(source = "badgeImageUrl", target = "badgeImageUrl")
    @Mapping(source = "active", target = "isActive")
    @Mapping(source = "earnedDate", target = "earnedDate")
    BadgeDTO toBadgeDto(UserBadge userBadge);
}