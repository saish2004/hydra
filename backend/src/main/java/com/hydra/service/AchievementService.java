package com.hydra.service;

import com.hydra.model.Achievement;
import com.hydra.model.User;
import com.hydra.model.UserAchievement;
import com.hydra.repository.AchievementRepository;
import com.hydra.repository.UserAchievementRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public AchievementService(AchievementRepository achievementRepository, UserAchievementRepository userAchievementRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @PostConstruct
    public void initAchievements() {
        createAchievementIfNotExist("First Check-In", "Completed your very first daily health evaluation.", "check_in");
        createAchievementIfNotExist("7 Day Streak", "Maintained a daily health check-in streak of 7 days.", "streak_7");
        createAchievementIfNotExist("30 Day Streak", "Maintained a daily health check-in streak of 30 days.", "streak_30");
        createAchievementIfNotExist("Hydration Master", "Met or exceeded your daily water intake goal.", "master");
    }

    private void createAchievementIfNotExist(String name, String description, String icon) {
        Optional<Achievement> exist = achievementRepository.findByName(name);
        if (exist.isEmpty()) {
            Achievement ac = Achievement.builder()
                    .name(name)
                    .description(description)
                    .icon(icon)
                    .build();
            achievementRepository.save(ac);
        }
    }

    @Transactional
    public void checkAndUnlock(User user, String achievementName) {
        Achievement achievement = achievementRepository.findByName(achievementName)
                .orElse(null);
        if (achievement == null) return;

        boolean alreadyUnlocked = userAchievementRepository.existsByUserAndAchievement(user, achievement);
        if (!alreadyUnlocked) {
            UserAchievement ua = UserAchievement.builder()
                    .user(user)
                    .achievement(achievement)
                    .unlockedAt(LocalDateTime.now())
                    .build();
            userAchievementRepository.save(ua);
            System.out.println("ACHIEVEMENT UNLOCKED FOR USER " + user.getEmail() + ": " + achievementName);
        }
    }

    public List<UserAchievement> getUnlockedAchievements(User user) {
        return userAchievementRepository.findByUser(user);
    }

    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }
}
