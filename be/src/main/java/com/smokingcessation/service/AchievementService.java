package com.smokingcessation.service;

import com.smokingcessation.dto.res.BadgeDTO;
import com.smokingcessation.dto.res.ProgressMilestoneDTO;
import com.smokingcessation.mapper.AchievementMapper;
import com.smokingcessation.model.*;
import com.smokingcessation.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchievementService {

    private final ProgressMilestoneRepository milestoneRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserSmokingProfileRepository userSmokingProfileRepository;
    private final SmokingEventRepository smokingEventRepository;
    private final UserRepository userRepository;
    private final AchievementMapper achievementMapper;

    @Transactional
    public void checkAndAwardMilestones(String email) {
        log.info("Checking milestones for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserSmokingProfile> activeProfileOpt = userSmokingProfileRepository.findByUserAndStatus(user, "active");
        if (activeProfileOpt.isEmpty()) {
            log.warn("No active smoking profile found for email: {}", email);
            return;
        }

        UserSmokingProfile profile = activeProfileOpt.get();
        LocalDate quitDate = profile.getQuitDate();
        if (quitDate == null) {
            log.warn("Quit date is null for profile_id: {}", profile.getProfileId());
            return;
        }

        Optional<SmokingEvent> latestEvent = smokingEventRepository.findTopByUserOrderByEventTimeDesc(user);
        LocalDateTime latestSmokingTime = latestEvent.map(SmokingEvent::getEventTime).orElse(null);
        log.info("Latest smoking event for email {}: {}", email, latestSmokingTime);

        long daysSinceQuit;
        if (latestSmokingTime != null && latestSmokingTime.toLocalDate().isAfter(quitDate)) {
            daysSinceQuit = ChronoUnit.DAYS.between(latestSmokingTime.toLocalDate(), LocalDate.now());
        } else {
            daysSinceQuit = ChronoUnit.DAYS.between(quitDate, LocalDate.now());
        }

        log.info("Days since quit for email {}: {}", email, daysSinceQuit);

        if (daysSinceQuit >= 0) {
            awardMilestoneIfEligible(user, daysSinceQuit);
        } else {
            log.warn("Days since quit is negative for email: {}", email);
        }
    }

    private void awardMilestoneIfEligible(User user, long daysSinceQuit) {
        Map<Long, ProgressMilestone.MilestoneType> milestoneMap = Map.of(
                1L, ProgressMilestone.MilestoneType.TWENTY_FOUR_HOURS,
                7L, ProgressMilestone.MilestoneType.ONE_WEEK,
                30L, ProgressMilestone.MilestoneType.ONE_MONTH,
                90L, ProgressMilestone.MilestoneType.THREE_MONTHS,
                180L, ProgressMilestone.MilestoneType.SIX_MONTHS,
                365L, ProgressMilestone.MilestoneType.ONE_YEAR
        );

        milestoneMap.forEach((days, milestoneType) -> {
            if (daysSinceQuit >= days && milestoneRepository.findByUserAndMilestoneType(user, milestoneType).isEmpty()) {
                log.info("Awarding milestone {} for email: {}", milestoneType, user.getEmail());
                ProgressMilestone milestone = new ProgressMilestone();
                milestone.setUser(user);
                milestone.setMilestoneType(milestoneType);
                milestone.setAchievedDate(LocalDateTime.now());
                milestone.setRewardPoints(calculateRewardPoints(milestoneType));
                milestoneRepository.save(milestone);

                awardBadge(user, milestoneType);
            }
        });
    }

    private int calculateRewardPoints(ProgressMilestone.MilestoneType milestoneType) {
        return switch (milestoneType) {
            case TWENTY_FOUR_HOURS -> 100;
            case ONE_WEEK -> 500;
            case ONE_MONTH -> 1000;
            case THREE_MONTHS -> 2500;
            case SIX_MONTHS -> 5000;
            case ONE_YEAR -> 10000;
        };
    }

    private void awardBadge(User user, ProgressMilestone.MilestoneType milestoneType) {
        String badgeType = switch (milestoneType) {
            case TWENTY_FOUR_HOURS -> "24H_NOSMOKE";
            case ONE_WEEK -> "1WEEK_NOSMOKE";
            case ONE_MONTH -> "1MONTH_NOSMOKE";
            case THREE_MONTHS -> "3MONTHS_NOSMOKE";
            case SIX_MONTHS -> "6MONTHS_NOSMOKE";
            case ONE_YEAR -> "1YEAR_NOSMOKE";
        };

        Badge badge = badgeRepository.findByBadgeType(badgeType)
                .orElseThrow(() -> new RuntimeException("Badge not found: " + badgeType));

        boolean alreadyAwarded = userBadgeRepository.findByUserAndBadgeType(user, badgeType).isPresent();
        if (alreadyAwarded) {
            log.info("Badge {} already awarded for user: {}", badgeType, user.getEmail());
            return;
        }

        UserBadge userBadge = new UserBadge();
        userBadge.setUser(user);
        userBadge.setBadge(badge);
        userBadge.setBadgeType(badgeType);
        userBadge.setBadgeImageUrl(badge.getBadgeImageUrl());
        userBadge.setEarnedDate(LocalDateTime.now());
        userBadge.setActive(true);
        userBadgeRepository.save(userBadge);

        log.info("Badge {} awarded to user {}", badgeType, user.getEmail());
    }

    public List<ProgressMilestoneDTO> getUserMilestones(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return milestoneRepository.findByUser(user).stream()
                .map(achievementMapper::toMilestoneDto)
                .toList();
    }

    public List<BadgeDTO> getUserBadges(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userBadgeRepository.findByUser(user).stream()
                .map(achievementMapper::toBadgeDto)
                .toList();
    }

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }


    public int getTotalBadgesByProfileName(String profileName) {
        User user = userRepository.findByProfileName(profileName)
                .orElseThrow(() -> new RuntimeException("User not found with profileName: " + profileName));
        return getTotalBadges(user);
    }

    public int getTotalBadges(User user) {
        return userBadgeRepository.findByUser(user).size();
    }

    @Transactional
    public void updateBadge(Long badgeId, Badge updatedBadge) {
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found with id: " + badgeId));

        badge.setBadgeName(updatedBadge.getBadgeName());
        badge.setBadgeDescription(updatedBadge.getBadgeDescription());
        badge.setBadgeImageUrl(updatedBadge.getBadgeImageUrl());
        badge.setActive(updatedBadge.isActive());
        badge.setCreatedAt(updatedBadge.getCreatedAt());

        badgeRepository.save(badge);
    }

}
