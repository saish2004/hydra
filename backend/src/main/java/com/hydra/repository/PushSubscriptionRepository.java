package com.hydra.repository;

import com.hydra.model.PushSubscription;
import com.hydra.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    List<PushSubscription> findByUser(User user);
    void deleteByEndpoint(String endpoint);
}
