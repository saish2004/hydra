package com.hydra.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_check_ins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyCheckIn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String urineColor;

    @Column(nullable = false)
    private String energyLevel;

    @Column(nullable = false)
    private String skinTexture;

    @Column(nullable = false)
    private Integer hydrationScore;

    @Column(nullable = false)
    private Integer fatigueScore;

    @Column(nullable = false)
    private String riskLevel;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(length = 2000)
    private String recommendations;
}
