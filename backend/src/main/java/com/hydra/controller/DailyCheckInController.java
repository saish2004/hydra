package com.hydra.controller;

import com.hydra.dto.DailyCheckInDto;
import com.hydra.service.DailyCheckInService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/checkin")
public class DailyCheckInController {

    private final DailyCheckInService dailyCheckInService;

    public DailyCheckInController(DailyCheckInService dailyCheckInService) {
        this.dailyCheckInService = dailyCheckInService;
    }

    @PostMapping
    public ResponseEntity<DailyCheckInDto> checkIn(@RequestBody DailyCheckInDto dto) {
        return ResponseEntity.ok(dailyCheckInService.checkIn(dto));
    }

    @GetMapping("/today")
    public ResponseEntity<DailyCheckInDto> getTodayCheckIn() {
        DailyCheckInDto today = dailyCheckInService.getTodayCheckIn();
        if (today == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(today);
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<DailyCheckInDto>> getWeeklyCheckIns() {
        return ResponseEntity.ok(dailyCheckInService.getWeeklyCheckIns());
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<DailyCheckInDto>> getMonthlyCheckIns() {
        return ResponseEntity.ok(dailyCheckInService.getMonthlyCheckIns());
    }
}
