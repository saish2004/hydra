package com.hydra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyCheckInDto {
    private Long id;
    private String urineColor;
    private String energyLevel;
    private String skinTexture;
    private Integer hydrationScore;
    private Integer fatigueScore;
    private String riskLevel;
    private LocalDate checkInDate;
    private String recommendations;
}
