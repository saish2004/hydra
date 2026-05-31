package com.hydra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private Integer hydrationScore;
    private Integer fatigueScore;
    private String riskLevel;
    private Integer waterConsumed;
    private Integer waterGoal;
    private Integer currentStreak;
    private Integer bestStreak;
    private List<String> recommendations;
    private Boolean checkedInToday;
}
