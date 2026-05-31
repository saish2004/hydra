package com.hydra.repository;

import com.hydra.model.Reminder;
import com.hydra.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUser(User user);
    List<Reminder> findByEnabled(Boolean enabled);
}
