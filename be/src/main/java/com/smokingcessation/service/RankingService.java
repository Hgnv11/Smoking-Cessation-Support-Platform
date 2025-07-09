package com.smokingcessation.service;

import com.smokingcessation.dto.rank.DaysQuitRank;
import com.smokingcessation.dto.rank.RewardPointRank;
import com.smokingcessation.dto.rank.PostCountRank;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.PostRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.ProgressMilestoneRepository;
import com.smokingcessation.repository.UserSmokingProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final UserRepository userRepository;
    private final UserSmokingProfileRepository profileRepository;
    private final ProgressMilestoneRepository milestoneRepository;
    private final PostRepository postRepository;

    public List<DaysQuitRank> getTopDaysSinceQuit() {
        return userRepository.findAll().stream()
                .filter(u -> u.getProfileName() != null)
                .map(user -> {
                    return profileRepository.findByUserAndStatus(user, "active")
                            .map(profile -> {
                                LocalDate quitDate = profile.getQuitDate();
                                if (quitDate != null) {
                                    long days = ChronoUnit.DAYS.between(quitDate, LocalDate.now());
                                    return new DaysQuitRank(user.getProfileName(), Math.max(0, days));
                                } else return null;
                            }).orElse(null);
                })
                .filter(rank -> rank != null)
                .sorted(Comparator.comparingLong(DaysQuitRank::daysSinceQuit).reversed())
                .limit(10)
                .toList();
    }

    public List<RewardPointRank> getTopRewardPoints() {
        return userRepository.findAll().stream()
                .filter(u -> u.getProfileName() != null)
                .map(user -> {
                    int total = milestoneRepository.findByUser(user).stream()
                            .mapToInt(m -> m.getRewardPoints())
                            .sum();
                    return new RewardPointRank(user.getProfileName(), total);
                })
                .sorted(Comparator.comparingInt(RewardPointRank::rewardPoints).reversed())
                .limit(10)
                .toList();
    }

    public List<PostCountRank> getTopPostCounts() {
        return userRepository.findAll().stream()
                .filter(u -> u.getProfileName() != null)
                .map(user -> {
                    int postCount = postRepository.countByUserAndIsApprovedTrue(user);
                    return new PostCountRank(user.getProfileName(), postCount);
                })
                .sorted(Comparator.comparingInt(PostCountRank::postCount).reversed())
                .limit(10)
                .toList();
    }
}
