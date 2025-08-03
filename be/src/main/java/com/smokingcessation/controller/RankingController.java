package com.smokingcessation.controller;

import com.smokingcessation.dto.rank.DaysQuitRank;
import com.smokingcessation.dto.rank.PostCountRank;
import com.smokingcessation.dto.rank.RewardPointRank;
import com.smokingcessation.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/days-quit")
    public List<DaysQuitRank> getTopDaysSinceQuit() {
        return rankingService.getTopDaysSinceQuit();
    }

    @GetMapping("/reward-points-milestone")
    public List<RewardPointRank> getTopRewardPoints() {
        return rankingService.getTopRewardPoints();
    }

    @GetMapping("/post-counts")
    public List<PostCountRank> getTopPostCounts() {
        return rankingService.getTopPostCounts();
    }
}
