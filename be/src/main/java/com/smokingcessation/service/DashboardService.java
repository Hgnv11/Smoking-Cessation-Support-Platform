package com.smokingcessation.service;

import com.smokingcessation.dto.res.PlanResultStatsDTO;
import com.smokingcessation.dto.res.UserGrowthDTO;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserSmokingProfile;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.repository.UserSmokingProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final UserSmokingProfileService userSmokingProfileService;
    private final UserSmokingProfileRepository userSmokingProfileRepository;

    public List<UserGrowthDTO> getUserGrowth7DayCompare() {
        List<UserGrowthDTO> result = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate thisWeekStart = today.minusDays(6);
        LocalDate lastWeekStart = thisWeekStart.minusDays(7);

        for (int i = 0; i < 7; i++) {
            LocalDate thisDay = thisWeekStart.plusDays(i);
            LocalDate lastDay = lastWeekStart.plusDays(i);

            long thisCount = userRepository.countByCreatedAtDate(thisDay);
            long lastCount = userRepository.countByCreatedAtDate(lastDay);


            result.add(new UserGrowthDTO(
                    formatDate(thisDay),
                    lastCount,
                    thisCount
            ));
        }

        return result;
    }

    public List<UserGrowthDTO> getUserGrowth30DayCompare() {
        List<UserGrowthDTO> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 4; i++) {
            LocalDate thisFrom = today.minusDays(i * 7 + 6);
            LocalDate thisTo = today.minusDays(i * 7);
            LocalDate lastFrom = thisFrom.minusWeeks(1);
            LocalDate lastTo = thisTo.minusWeeks(1);

            long thisCount = userRepository.countByCreatedAtBetween(
                    toDateTime(thisFrom), toDateTime(thisTo.plusDays(1)));

            long lastCount = userRepository.countByCreatedAtBetween(
                    toDateTime(lastFrom), toDateTime(lastTo.plusDays(1)));

            String label = String.format(
                    "Week %d (%s ~ %s)",
                    4 - i,
                    formatDate(thisFrom),
                    formatDate(thisTo)
            );

            result.add(new UserGrowthDTO(label, lastCount, thisCount));
        }

        return result;
    }

    private LocalDateTime toDateTime(LocalDate date) {
        return date.atStartOfDay();
    }

    private String formatDate(LocalDate date) {
        return date.getDayOfMonth() + " " + date.getMonth().toString().substring(0, 3);
    }

    public Map<String, PlanResultStatsDTO> getPlanResultStats() {
        List<User> allUsers = userRepository.findAll();
        Map<String, List<User>> groupedUsers = allUsers.stream()
                .collect(Collectors.groupingBy(u -> Boolean.TRUE.equals(u.getHasActive()) ? "premium" : "free"));

        Map<String, PlanResultStatsDTO> result = new HashMap<>();

        groupedUsers.forEach((key, users) -> {
            int success = 0;
            int failed = 0;

            for (User user : users) {
                List<UserSmokingProfile> completedPlans = userSmokingProfileRepository
                        .findAllByUserAndStatus(user, "completed");

                for (UserSmokingProfile plan : completedPlans) {
                    String resultStr = userSmokingProfileService.evaluatePlanResult(user.getEmail(), plan.getProfileId());
                    if ("success".equalsIgnoreCase(resultStr)) {
                        success++;
                    } else if ("failed".equalsIgnoreCase(resultStr)) {
                        failed++;
                    }
                }
            }

            int total = success + failed;
            String rate = total > 0 ? String.format("%.1f", (success * 100.0 / total)) : "0.0";
            List<PlanResultStatsDTO.DistributionItem> distribution = List.of(
                    new PlanResultStatsDTO.DistributionItem("Success", success),
                    new PlanResultStatsDTO.DistributionItem("Failed", failed)
            );

            result.put(key, new PlanResultStatsDTO(total, success, failed, rate, distribution));
        });

        return result;
    }

}
