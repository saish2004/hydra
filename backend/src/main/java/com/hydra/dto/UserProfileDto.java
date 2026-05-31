package com.hydra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String fullName;
    private String email;
    private Integer age;
    private String gender;
    private Double weight;
    private Integer dailyWaterGoal;
    private Boolean remindersEnabled;
    private String reminderInterval;
}
