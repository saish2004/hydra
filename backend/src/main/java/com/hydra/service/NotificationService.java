package com.hydra.service;

import com.hydra.dto.PushSubscriptionDto;
import com.hydra.model.Notification;
import com.hydra.model.PushSubscription;
import com.hydra.model.User;
import com.hydra.repository.NotificationRepository;
import com.hydra.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import java.security.Security;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    static {
        if (Security.getProvider("BC") == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    private final NotificationRepository notificationRepository;
    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final AuthService authService;

    private final String publicKey;
    private final String privateKey;
    private final String subject;

    public NotificationService(
            NotificationRepository notificationRepository,
            PushSubscriptionRepository pushSubscriptionRepository,
            AuthService authService,
            @Value("${hydra.webpush.public-key}") String publicKey,
            @Value("${hydra.webpush.private-key}") String privateKey,
            @Value("${hydra.webpush.subject}") String subject) {
        this.notificationRepository = notificationRepository;
        this.pushSubscriptionRepository = pushSubscriptionRepository;
        this.authService = authService;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.subject = subject;
    }

    @Transactional
    public void subscribe(PushSubscriptionDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        
        // Remove duplicate endpoints if any
        pushSubscriptionRepository.deleteByEndpoint(dto.getEndpoint());

        PushSubscription sub = PushSubscription.builder()
                .user(user)
                .endpoint(dto.getEndpoint())
                .p256dh(dto.getP256dh())
                .auth(dto.getAuth())
                .build();

        pushSubscriptionRepository.save(sub);
    }

    @Transactional
    public void unsubscribe(String endpoint) {
        pushSubscriptionRepository.deleteByEndpoint(endpoint);
    }

    @Transactional
    public void sendPushNotification(User user, String title, String message) {
        // 1. Log notification in database
        Notification notif = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .timestamp(LocalDateTime.now())
                .readStatus(false)
                .build();
        notificationRepository.save(notif);

        // 2. Fetch all registered browser endpoints for this user
        List<PushSubscription> subs = pushSubscriptionRepository.findByUser(user);

        // 3. Send via WebPush
        for (PushSubscription sub : subs) {
            try {
                PushService pushService = new PushService(publicKey, privateKey, subject);
                nl.martijndwars.webpush.Subscription subscription = new nl.martijndwars.webpush.Subscription(
                        sub.getEndpoint(),
                        new nl.martijndwars.webpush.Subscription.Keys(sub.getP256dh(), sub.getAuth())
                );

                nl.martijndwars.webpush.Notification notification = new nl.martijndwars.webpush.Notification(
                        subscription,
                        String.format("{\"title\":\"%s\", \"body\":\"%s\"}", title, message)
                );

                pushService.send(notification);
                System.out.println("PUSH SENT SUCCESSFULLY TO: " + sub.getEndpoint());
            } catch (Exception e) {
                System.err.println("Failed to send push notification to subscription " + sub.getId() + ": " + e.getMessage());
                // Clean up stale or expired push endpoints
                if (e.getMessage() != null && (e.getMessage().contains("410") || e.getMessage().contains("404"))) {
                    pushSubscriptionRepository.delete(sub);
                }
            }
        }
    }

    public List<Notification> getNotifications() {
        User user = authService.getCurrentAuthenticatedUser();
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setReadStatus(true);
        notificationRepository.save(notif);
    }
}
