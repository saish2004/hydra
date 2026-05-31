package com.hydra.repository;

import com.hydra.model.User;
import com.hydra.model.WaterLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface WaterLogRepository extends JpaRepository<WaterLog, Long> {
    List<WaterLog> findByUserAndLogDate(User user, LocalDate date);
    List<WaterLog> findByUserAndLogDateBetweenOrderByLogDateAsc(User user, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(w.amount), 0) FROM WaterLog w WHERE w.user = :user AND w.logDate = :date")
    Integer sumAmountByUserAndLogDate(User user, LocalDate date);
}
