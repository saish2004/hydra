package com.hydra.controller;

import com.hydra.dto.ReminderDto;
import com.hydra.service.ReminderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    public ResponseEntity<List<ReminderDto>> getReminders() {
        return ResponseEntity.ok(reminderService.getReminders());
    }

    @PostMapping
    public ResponseEntity<ReminderDto> addReminder(@RequestBody ReminderDto dto) {
        return ResponseEntity.ok(reminderService.addReminder(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderDto> updateReminder(@PathVariable Long id, @RequestBody ReminderDto dto) {
        return ResponseEntity.ok(reminderService.updateReminder(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.noContent().build();
    }
}
