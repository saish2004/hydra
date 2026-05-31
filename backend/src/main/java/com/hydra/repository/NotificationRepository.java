package com.hydra.repository;

import com.hydra.model.Notification;
import com.hydra.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByTimestampDesc(User user);
    List<Notification> findByUserAndReadStatusOrderByTimestampDesc(User user, Boolean readStatus);
}
