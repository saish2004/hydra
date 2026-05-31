package com.hydra.controller;

import com.hydra.dto.WaterLogDto;
import com.hydra.service.WaterLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/water")
public class WaterLogController {

    private final WaterLogService waterLogService;

    public WaterLogController(WaterLogService waterLogService) {
        this.waterLogService = waterLogService;
    }

    @PostMapping
    public ResponseEntity<WaterLogDto> addWaterLog(@RequestParam Integer amount) {
        return ResponseEntity.ok(waterLogService.addWaterLog(amount));
    }

    @GetMapping("/today")
    public ResponseEntity<Integer> getTodayConsumption() {
        return ResponseEntity.ok(waterLogService.getTodayConsumption());
    }

    @GetMapping("/today-logs")
    public ResponseEntity<List<WaterLogDto>> getTodayLogs() {
        return ResponseEntity.ok(waterLogService.getTodayLogs());
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<WaterLogDto>> getWeeklyLogs() {
        return ResponseEntity.ok(waterLogService.getWeeklyLogs());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWaterLog(@PathVariable Long id) {
        waterLogService.deleteWaterLog(id);
        return ResponseEntity.noContent().build();
    }
}
