package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.BadgeDTO;
import com.smokingcessation.dto.res.ProgressMilestoneDTO;
import com.smokingcessation.model.Badge;
import com.smokingcessation.model.ProgressMilestone;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserBadge;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T21:30:16+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class AchievementMapperImpl implements AchievementMapper {

    @Override
    public ProgressMilestoneDTO toMilestoneDto(ProgressMilestone milestone) {
        if ( milestone == null ) {
            return null;
        }

        ProgressMilestoneDTO.ProgressMilestoneDTOBuilder progressMilestoneDTO = ProgressMilestoneDTO.builder();

        progressMilestoneDTO.milestoneId( milestone.getMilestoneId() );
        Integer userId = milestoneUserUserId( milestone );
        if ( userId != null ) {
            progressMilestoneDTO.userId( userId.longValue() );
        }
        if ( milestone.getMilestoneType() != null ) {
            progressMilestoneDTO.milestoneType( milestone.getMilestoneType().name() );
        }
        progressMilestoneDTO.achievedDate( milestone.getAchievedDate() );
        progressMilestoneDTO.rewardPoints( milestone.getRewardPoints() );

        return progressMilestoneDTO.build();
    }

    @Override
    public BadgeDTO toBadgeDto(UserBadge userBadge) {
        if ( userBadge == null ) {
            return null;
        }

        BadgeDTO.BadgeDTOBuilder badgeDTO = BadgeDTO.builder();

        badgeDTO.badgeId( userBadgeBadgeBadgeId( userBadge ) );
        badgeDTO.badgeType( userBadge.getBadgeType() );
        badgeDTO.badgeImageUrl( userBadge.getBadgeImageUrl() );
        badgeDTO.isActive( userBadge.isActive() );
        badgeDTO.earnedDate( userBadge.getEarnedDate() );

        return badgeDTO.build();
    }

    private Integer milestoneUserUserId(ProgressMilestone progressMilestone) {
        if ( progressMilestone == null ) {
            return null;
        }
        User user = progressMilestone.getUser();
        if ( user == null ) {
            return null;
        }
        Integer userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }

    private Long userBadgeBadgeBadgeId(UserBadge userBadge) {
        if ( userBadge == null ) {
            return null;
        }
        Badge badge = userBadge.getBadge();
        if ( badge == null ) {
            return null;
        }
        Long badgeId = badge.getBadgeId();
        if ( badgeId == null ) {
            return null;
        }
        return badgeId;
    }
}
