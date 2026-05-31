package com.hydra.service;

import com.hydra.dto.DashboardDto;
import com.hydra.exception.ResourceNotFoundException;
import com.hydra.model.*;
import com.hydra.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {

    private final DailyCheckInRepository dailyCheckInRepository;
    private final WaterLogRepository waterLogRepository;
    private final UserProfileRepository userProfileRepository;
    private final StreakRepository streakRepository;
    private final AuthService authService;

    public DashboardService(
            DailyCheckInRepository dailyCheckInRepository,
            WaterLogRepository waterLogRepository,
            UserProfileRepository userProfileRepository,
            StreakRepository streakRepository,
            AuthService authService) {
        this.dailyCheckInRepository = dailyCheckInRepository;
        this.waterLogRepository = waterLogRepository;
        this.userProfileRepository = userProfileRepository;
        this.streakRepository = streakRepository;
        this.authService = authService;
    }

    public DashboardDto getDashboardData() {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate today = LocalDate.now();

        // 1. Get today's check-in
        Optional<DailyCheckIn> checkInOpt = dailyCheckInRepository.findByUserAndCheckInDate(user, today);
        Integer hydrationScore = 100;
        Integer fatigueScore = 0;
        String riskLevel = "Excellent";
        List<String> recommendations = Collections.emptyList();
        boolean checkedInToday = false;

        if (checkInOpt.isPresent()) {
            DailyCheckIn checkIn = checkInOpt.get();
            hydrationScore = checkIn.getHydrationScore();
            fatigueScore = checkIn.getFatigueScore();
            riskLevel = checkIn.getRiskLevel();
            checkedInToday = true;
            if (checkIn.getRecommendations() != null && !checkIn.getRecommendations().isEmpty()) {
                recommendations = Arrays.asList(checkIn.getRecommendations().split(" \\| "));
            }
        } else {
            // Check if there was a check-in yesterday/previously to carry over recommendations or defaults
            List<DailyCheckIn> latestList = dailyCheckInRepository.findLatestByUser(user);
            if (!latestList.isEmpty()) {
                DailyCheckIn latest = latestList.get(0);
                hydrationScore = latest.getHydrationScore();
                fatigueScore = latest.getFatigueScore();
                riskLevel = latest.getRiskLevel();
                if (latest.getRecommendations() != null && !latest.getRecommendations().isEmpty()) {
                    recommendations = Arrays.asList(latest.getRecommendations().split(" \\| "));
                }
            } else {
                recommendations = Arrays.asList("Complete your first check-in to get recommendations!", "Drink 250ml water to start your day.");
            }
        }

        // 2. Get today's water consumption
        Integer waterConsumed = waterLogRepository.sumAmountByUserAndLogDate(user, today);
        if (waterConsumed == null) {
            waterConsumed = 0;
        }

        // 3. Get water goal from profile
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        Integer waterGoal = profile.getDailyWaterGoal();

        // 4. Get streaks
        Streak streak = streakRepository.findByUser(user)
                .orElse(Streak.builder().currentStreak(0).bestStreak(0).build());

        return DashboardDto.builder()
                .hydrationScore(hydrationScore)
                .fatigueScore(fatigueScore)
                .riskLevel(riskLevel)
                .waterConsumed(waterConsumed)
                .waterGoal(waterGoal)
                .currentStreak(streak.getCurrentStreak())
                .bestStreak(streak.getBestStreak())
                .recommendations(recommendations)
                .checkedInToday(checkedInToday)
                .build();
    }
}
