package com.hydra.repository;

import com.hydra.model.Streak;
import com.hydra.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StreakRepository extends JpaRepository<Streak, Long> {
    Optional<Streak> findByUser(User user);
}
