package com.hydra.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String fullName;
    private String email;
    private Integer age;
    private String gender;
    private Double weight; // in kg
    private Integer dailyWaterGoal; // in ml
    private Boolean remindersEnabled;
    private String reminderInterval; // "1" hour, "2" hours, etc.
}
