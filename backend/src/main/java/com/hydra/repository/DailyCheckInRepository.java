package com.hydra.repository;

import com.hydra.model.DailyCheckIn;
import com.hydra.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, Long> {
    Optional<DailyCheckIn> findByUserAndCheckInDate(User user, LocalDate date);
    List<DailyCheckIn> findByUserAndCheckInDateBetweenOrderByCheckInDateAsc(User user, LocalDate start, LocalDate end);
    List<DailyCheckIn> findByUserOrderByCheckInDateDesc(User user);
    
    @Query("SELECT d FROM DailyCheckIn d WHERE d.user = :user ORDER BY d.checkInDate DESC")
    List<DailyCheckIn> findLatestByUser(User user);
}
