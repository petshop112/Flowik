package fooTalent.flowik.notifications.services;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.notifications.entities.Notification;
import fooTalent.flowik.notifications.enums.NotificationType;
import fooTalent.flowik.notifications.repositories.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {
   @Autowired
        private NotificationRepository repository;

    private String resolveCreatedBy(String fallback) {
        try {
            return SecurityUtil.getAuthenticatedEmail();
        } catch (RuntimeException e) {
            return fallback;
        }
    }
    public Notification createStockNotification(String title, String description, Long referenceId, String createdBy) {
        String finalCreatedBy = (createdBy != null) ? createdBy : resolveCreatedBy("system");

        Notification notification = Notification.builder()
                .title(title)
                .description(description)
                .type(NotificationType.STOCK)
                .referenceId(referenceId)
                .readNotification(false)
                .createdBy(finalCreatedBy)
                .build();

        return repository.save(notification);
    }

    public void createDebtNotification(String title, String description, Long debtId, String createdBy) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setDescription(description);
        notification.setReferenceId(debtId);
        notification.setCreatedBy(createdBy);
        notification.setType(NotificationType.DEBT);
        notification.setReadNotification(false);
        repository.save(notification);
    }

        public void markAsRead(Long id, String userEmail) {
            repository.findByIdAndCreatedBy(id, userEmail).ifPresent(notification -> {
                notification.setReadNotification(true);
                repository.save(notification);
            });
        }

    public List<Notification> listAll() {
        return repository.findAll();
    }

        public List<Notification> listByType(String userEmail, NotificationType type) {
            return repository.findByCreatedByAndType(userEmail, type);
        }

    public boolean hasActiveStockNotification(Long productId, String userEmail, String type) {
        return repository.existsByReferenceIdAndCreatedByAndTitle(productId, userEmail, type);
    }
    public boolean hasActiveDebtNotification(Long debtId, String createdBy, String title) {
        return repository.existsByReferenceIdAndCreatedByAndTitleAndTypeAndReadNotificationIsFalse(
                debtId, createdBy, title, NotificationType.DEBT
        );
    }

    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void deleteAllOldNotifications() {
        LocalDate threshold = LocalDate.now().minusDays(30);
        repository.deleteByGenerationDateBefore(threshold);
    }
        }
