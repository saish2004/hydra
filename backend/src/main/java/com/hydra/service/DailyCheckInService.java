package com.hydra.service;

import com.hydra.dto.DailyCheckInDto;
import com.hydra.exception.BadRequestException;
import com.hydra.model.DailyCheckIn;
import com.hydra.model.Streak;
import com.hydra.model.User;
import com.hydra.repository.DailyCheckInRepository;
import com.hydra.repository.StreakRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DailyCheckInService {

    private final DailyCheckInRepository dailyCheckInRepository;
    private final StreakRepository streakRepository;
    private final AuthService authService;
    private final AchievementService achievementService;

    public DailyCheckInService(
            DailyCheckInRepository dailyCheckInRepository,
            StreakRepository streakRepository,
            AuthService authService,
            AchievementService achievementService) {
        this.dailyCheckInRepository = dailyCheckInRepository;
        this.streakRepository = streakRepository;
        this.authService = authService;
        this.achievementService = achievementService;
    }

    @Transactional
    public DailyCheckInDto checkIn(DailyCheckInDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate today = LocalDate.now();

        // Prevent duplicate check-in today
        Optional<DailyCheckIn> existingCheckIn = dailyCheckInRepository.findByUserAndCheckInDate(user, today);
        if (existingCheckIn.isPresent()) {
            throw new BadRequestException("You have already checked in today.");
        }

        // 1. Calculate Scores and Risk
        int hydrationScore = calculateHydrationScore(dto.getUrineColor(), dto.getSkinTexture(), dto.getEnergyLevel());
        int fatigueScore = calculateFatigueScore(dto.getEnergyLevel(), hydrationScore);
        String riskLevel = determineRiskLevel(hydrationScore);

        // 2. Generate Recommendations
        List<String> recommendations = generateRecommendations(hydrationScore, fatigueScore);
        String recommendationsJoined = String.join(" | ", recommendations);

        // 3. Save CheckIn
        DailyCheckIn checkIn = DailyCheckIn.builder()
                .user(user)
                .urineColor(dto.getUrineColor())
                .energyLevel(dto.getEnergyLevel())
                .skinTexture(dto.getSkinTexture())
                .hydrationScore(hydrationScore)
                .fatigueScore(fatigueScore)
                .riskLevel(riskLevel)
                .checkInDate(today)
                .recommendations(recommendationsJoined)
                .build();

        DailyCheckIn saved = dailyCheckInRepository.save(checkIn);

        // 4. Update Streak
        updateStreak(user, today);

        // 5. Unlock "First Check-In" Achievement
        achievementService.checkAndUnlock(user, "First Check-In");

        return mapToDto(saved);
    }

    public List<DailyCheckInDto> getWeeklyCheckIns() {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6); // Last 7 days
        List<DailyCheckIn> list = dailyCheckInRepository.findByUserAndCheckInDateBetweenOrderByCheckInDateAsc(user, start, end);
        
        List<DailyCheckInDto> dtoList = new ArrayList<>();
        for (DailyCheckIn d : list) {
            dtoList.add(mapToDto(d));
        }
        return dtoList;
    }

    public List<DailyCheckInDto> getMonthlyCheckIns() {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(29); // Last 30 days
        List<DailyCheckIn> list = dailyCheckInRepository.findByUserAndCheckInDateBetweenOrderByCheckInDateAsc(user, start, end);
        
        List<DailyCheckInDto> dtoList = new ArrayList<>();
        for (DailyCheckIn d : list) {
            dtoList.add(mapToDto(d));
        }
        return dtoList;
    }

    public DailyCheckInDto getTodayCheckIn() {
        User user = authService.getCurrentAuthenticatedUser();
        Optional<DailyCheckIn> checkIn = dailyCheckInRepository.findByUserAndCheckInDate(user, LocalDate.now());
        return checkIn.map(this::mapToDto).orElse(null);
    }

    // Scoring Engine helper algorithms
    private int calculateHydrationScore(String urine, String skin, String energy) {
        int base = 100;

        // Urine color impact
        if ("Light yellow".equalsIgnoreCase(urine)) {
            base = 85;
        } else if ("Dark yellow".equalsIgnoreCase(urine)) {
            base = 50;
        } else if ("Very dark".equalsIgnoreCase(urine)) {
            base = 20;
        }

        // Skin dry impact
        if ("Slightly dry".equalsIgnoreCase(skin)) {
            base -= 10;
        } else if ("Dry".equalsIgnoreCase(skin)) {
            base -= 20;
        } else if ("Very dry".equalsIgnoreCase(skin)) {
            base -= 30;
        }

        // Energy exhaustion impact
        if ("Normal".equalsIgnoreCase(energy)) {
            base -= 5;
        } else if ("Tired".equalsIgnoreCase(energy)) {
            base -= 15;
        } else if ("Extremely exhausted".equalsIgnoreCase(energy)) {
            base -= 25;
        }

        return Math.max(0, Math.min(100, base));
    }

    private int calculateFatigueScore(String energy, int hydrationScore) {
        int base = 10;

        if ("Normal".equalsIgnoreCase(energy)) {
            base = 35;
        } else if ("Tired".equalsIgnoreCase(energy)) {
            base = 70;
        } else if ("Extremely exhausted".equalsIgnoreCase(energy)) {
            base = 95;
        }

        // Dehydration induced fatigue modifier
        if (hydrationScore < 30) {
            base += 30;
        } else if (hydrationScore < 50) {
            base += 20;
        } else if (hydrationScore < 70) {
            base += 10;
        } else if (hydrationScore >= 85) {
            base -= 5;
        }

        return Math.max(0, Math.min(100, base));
    }

    private String determineRiskLevel(int hydrationScore) {
        if (hydrationScore >= 85) return "Excellent";
        if (hydrationScore >= 70) return "Good";
        if (hydrationScore >= 50) return "Mild Dehydration";
        if (hydrationScore >= 30) return "Moderate Dehydration";
        return "Severe Dehydration";
    }

    private List<String> generateRecommendations(int hydrationScore, int fatigueScore) {
        List<String> recommendations = new ArrayList<>();

        if (hydrationScore < 30) {
            recommendations.add("Drink 750ml water immediately");
            recommendations.add("Avoid any direct heat");
            recommendations.add("Eat juicy watermelon or cucumbers");
            recommendations.add("Limit caffeine and sugary drinks");
        } else if (hydrationScore < 50) {
            recommendations.add("Drink 500ml water right away");
            recommendations.add("Add electrolytes to your glass");
            recommendations.add("Reduce screen time to rest eyes");
        } else if (hydrationScore < 70) {
            recommendations.add("Drink 250ml water soon");
            recommendations.add("Keep a reusable bottle nearby");
            recommendations.add("Snack on fresh fruits");
        } else {
            recommendations.add("Hydration is optimal! Keep it up");
            recommendations.add("Take a small walk to stay active");
        }

        if (fatigueScore > 75) {
            recommendations.add("Take a short break and rest your body");
            recommendations.add("Schedule a full 8-hour sleep tonight");
        } else if (fatigueScore > 40) {
            recommendations.add("Do a light stretching sequence");
            recommendations.add("Step outside for fresh air");
        }

        return recommendations;
    }

    private void updateStreak(User user, LocalDate today) {
        Streak streak = streakRepository.findByUser(user)
                .orElse(Streak.builder().user(user).currentStreak(0).bestStreak(0).build());

        LocalDate lastCheckIn = streak.getLastCheckInDate();

        if (lastCheckIn == null) {
            // First ever check-in
            streak.setCurrentStreak(1);
            streak.setBestStreak(Math.max(1, streak.getBestStreak()));
        } else if (lastCheckIn.equals(today.minusDays(1))) {
            // Continued streak
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            streak.setBestStreak(Math.max(streak.getCurrentStreak(), streak.getBestStreak()));
        } else if (!lastCheckIn.equals(today)) {
            // Broken streak (and not duplicate check-in)
            streak.setCurrentStreak(1);
        }

        streak.setLastCheckInDate(today);
        streakRepository.save(streak);

        // Check for streak milestones
        if (streak.getCurrentStreak() >= 7) {
            achievementService.checkAndUnlock(user, "7 Day Streak");
        }
        if (streak.getCurrentStreak() >= 30) {
            achievementService.checkAndUnlock(user, "30 Day Streak");
        }
    }

    private DailyCheckInDto mapToDto(DailyCheckIn d) {
        return DailyCheckInDto.builder()
                .id(d.getId())
                .urineColor(d.getUrineColor())
                .energyLevel(d.getEnergyLevel())
                .skinTexture(d.getSkinTexture())
                .hydrationScore(d.getHydrationScore())
                .fatigueScore(d.getFatigueScore())
                .riskLevel(d.getRiskLevel())
                .checkInDate(d.getCheckInDate())
                .recommendations(d.getRecommendations())
                .build();
    }
}
