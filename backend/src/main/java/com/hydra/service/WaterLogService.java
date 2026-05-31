package com.hydra.service;

import com.hydra.dto.WaterLogDto;
import com.hydra.exception.ResourceNotFoundException;
import com.hydra.exception.BadRequestException;
import com.hydra.model.User;
import com.hydra.model.UserProfile;
import com.hydra.model.WaterLog;
import com.hydra.repository.UserProfileRepository;
import com.hydra.repository.WaterLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class WaterLogService {

    private final WaterLogRepository waterLogRepository;
    private final UserProfileRepository userProfileRepository;
    private final AuthService authService;
    private final AchievementService achievementService;

    public WaterLogService(
            WaterLogRepository waterLogRepository,
            UserProfileRepository userProfileRepository,
            AuthService authService,
            AchievementService achievementService) {
        this.waterLogRepository = waterLogRepository;
        this.userProfileRepository = userProfileRepository;
        this.authService = authService;
        this.achievementService = achievementService;
    }

    @Transactional
    public WaterLogDto addWaterLog(Integer amount) {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate today = LocalDate.now();

        WaterLog log = WaterLog.builder()
                .user(user)
                .amount(amount)
                .timestamp(LocalDateTime.now())
                .logDate(today)
                .build();

        WaterLog saved = waterLogRepository.save(log);

        // Check if daily water intake goal is met
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        Integer totalConsumedToday = waterLogRepository.sumAmountByUserAndLogDate(user, today);
        if (totalConsumedToday >= profile.getDailyWaterGoal()) {
            achievementService.checkAndUnlock(user, "Hydration Master");
        }

        return mapToDto(saved);
    }

    public Integer getTodayConsumption() {
        User user = authService.getCurrentAuthenticatedUser();
        Integer sum = waterLogRepository.sumAmountByUserAndLogDate(user, LocalDate.now());
        return sum != null ? sum : 0;
    }

    public List<WaterLogDto> getTodayLogs() {
        User user = authService.getCurrentAuthenticatedUser();
        List<WaterLog> logs = waterLogRepository.findByUserAndLogDate(user, LocalDate.now());
        List<WaterLogDto> dtoList = new ArrayList<>();
        for (WaterLog l : logs) {
            dtoList.add(mapToDto(l));
        }
        return dtoList;
    }

    public List<WaterLogDto> getWeeklyLogs() {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        List<WaterLog> logs = waterLogRepository.findByUserAndLogDateBetweenOrderByLogDateAsc(user, start, end);
        List<WaterLogDto> dtoList = new ArrayList<>();
        for (WaterLog l : logs) {
            dtoList.add(mapToDto(l));
        }
        return dtoList;
    }

    @Transactional
    public void deleteWaterLog(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        WaterLog log = waterLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Water log not found"));
        
        if (!log.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to delete this log");
        }
        waterLogRepository.delete(log);
    }

    private WaterLogDto mapToDto(WaterLog l) {
        return WaterLogDto.builder()
                .id(l.getId())
                .amount(l.getAmount())
                .timestamp(l.getTimestamp())
                .logDate(l.getLogDate())
                .build();
    }
}
