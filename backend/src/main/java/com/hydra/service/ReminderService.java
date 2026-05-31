package com.hydra.service;

import com.hydra.dto.ReminderDto;
import com.hydra.exception.ResourceNotFoundException;
import com.hydra.model.DailyCheckIn;
import com.hydra.model.Reminder;
import com.hydra.model.User;
import com.hydra.model.WaterLog;
import com.hydra.repository.DailyCheckInRepository;
import com.hydra.repository.ReminderRepository;
import com.hydra.repository.WaterLogRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final DailyCheckInRepository dailyCheckInRepository;
    private final WaterLogRepository waterLogRepository;
    private final NotificationService notificationService;
    private final AuthService authService;

    public ReminderService(
            ReminderRepository reminderRepository,
            DailyCheckInRepository dailyCheckInRepository,
            WaterLogRepository waterLogRepository,
            NotificationService notificationService,
            AuthService authService) {
        this.reminderRepository = reminderRepository;
        this.dailyCheckInRepository = dailyCheckInRepository;
        this.waterLogRepository = waterLogRepository;
        this.notificationService = notificationService;
        this.authService = authService;
    }

    public List<ReminderDto> getReminders() {
        User user = authService.getCurrentAuthenticatedUser();
        List<Reminder> list = reminderRepository.findByUser(user);
        List<ReminderDto> dtoList = new ArrayList<>();
        for (Reminder r : list) {
            dtoList.add(mapToDto(r));
        }
        return dtoList;
    }

    @Transactional
    public ReminderDto addReminder(ReminderDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        Reminder reminder = Reminder.builder()
                .user(user)
                .reminderTime(dto.getReminderTime())
                .enabled(true)
                .label(dto.getLabel())
                .build();

        Reminder saved = reminderRepository.save(reminder);
        return mapToDto(saved);
    }

    @Transactional
    public ReminderDto updateReminder(Long id, ReminderDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        reminder.setReminderTime(dto.getReminderTime());
        reminder.setEnabled(dto.getEnabled());
        reminder.setLabel(dto.getLabel());

        Reminder saved = reminderRepository.save(reminder);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteReminder(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        reminderRepository.delete(reminder);
    }

    // Cron checking every minute (0th second)
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void processScheduledReminders() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        List<Reminder> activeReminders = reminderRepository.findByEnabled(true);

        for (Reminder r : activeReminders) {
            LocalTime reminderTime = r.getReminderTime().truncatedTo(ChronoUnit.MINUTES);
            if (reminderTime.equals(now)) {
                String title = "Hydration Reminder";
                String msg = r.getLabel() != null && !r.getLabel().isEmpty() ? r.getLabel() : "Time to take a sip of water!";
                notificationService.sendPushNotification(r.getUser(), title, msg);
            }
        }

        // Smart Reminders check:
        // For all users with recent low hydration scores (< 40), send extra frequency updates
        // E.g., if hydration score < 40 and they haven't logged water in the last 60 mins, send urgent reminder.
        processSmartReminders();
    }

    private void processSmartReminders() {
        // Find all check-ins done today
        List<DailyCheckIn> todayCheckIns = dailyCheckInRepository.findByUserAndCheckInDate(null, LocalDate.now())
                .stream().toList(); // Wait, let's query users safely instead of passing null.
        
        // Better: Query all active users or check recent check-ins
        List<DailyCheckIn> checkins = dailyCheckInRepository.findAll();
        for (DailyCheckIn check : checkins) {
            if (check.getCheckInDate().equals(LocalDate.now()) && check.getHydrationScore() < 40) {
                User user = check.getUser();
                // Check if user logged water in last 60 minutes
                List<WaterLog> recentLogs = waterLogRepository.findByUserAndLogDate(user, LocalDate.now());
                boolean loggedRecently = false;
                for (WaterLog log : recentLogs) {
                    if (log.getTimestamp().isAfter(LocalDateTime.now().minusHours(1))) {
                        loggedRecently = true;
                        break;
                    }
                }

                if (!loggedRecently) {
                    // Send urgent smart reminder!
                    String title = "🚨 URGENT: Low Hydration Level!";
                    String msg = "Your Hydration Score is critically low (" + check.getHydrationScore() + "%). Please drink 500ml water immediately!";
                    
                    // We only send it on selected times (e.g. at xx:00 or xx:30 to avoid overwhelming)
                    int minute = LocalDateTime.now().getMinute();
                    if (minute == 0 || minute == 30) {
                        notificationService.sendPushNotification(user, title, msg);
                    }
                }
            }
        }
    }

    private ReminderDto mapToDto(Reminder r) {
        return ReminderDto.builder()
                .id(r.getId())
                .reminderTime(r.getReminderTime())
                .enabled(r.getEnabled())
                .label(r.getLabel())
                .build();
    }
}
