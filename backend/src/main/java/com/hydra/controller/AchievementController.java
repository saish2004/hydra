package com.hydra.controller;

import com.hydra.model.Achievement;
import com.hydra.model.User;
import com.hydra.model.UserAchievement;
import com.hydra.service.AchievementService;
import com.hydra.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;
    private final AuthService authService;

    public AchievementController(AchievementService achievementService, AuthService authService) {
        this.achievementService = achievementService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Achievement>> getAllAchievements() {
        return ResponseEntity.ok(achievementService.getAllAchievements());
    }

    @GetMapping("/unlocked")
    public ResponseEntity<List<UserAchievement>> getUnlockedAchievements() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(achievementService.getUnlockedAchievements(user));
    }
}
