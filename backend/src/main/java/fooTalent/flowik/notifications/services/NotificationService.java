package fooTalent.flowik.notifications.services;


import fooTalent.flowik.notifications.entities.Notification;
import fooTalent.flowik.notifications.enums.NotificationType;
import fooTalent.flowik.notifications.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {



        @Autowired
        private NotificationRepository repository;

        public Notification createStockNotification(String title, String description, Long referenceId) {
            Notification notification = Notification.builder()
                    .title(title)
                    .description(description)
                    .type(NotificationType.STOCK)
                    .referenceId(referenceId)
                    .readNotification(false)
                    .build();
            return repository.save(notification);
        }

        public Notification createDebtNotification(String title, String description, Long referenceId) {
            Notification notification = Notification.builder()
                    .title(title)
                    .description(description)
                    .type(NotificationType.DEBT)
                    .referenceId(referenceId)
                    .readNotification(false)
                    .build();
            return repository.save(notification);
        }

        public void markAsRead(Long id, String userEmail) {
            repository.findByIdAndCreatedBy(id, userEmail).ifPresent(notification -> {
                notification.setReadNotification(true);
                repository.save(notification);
            });
        }

        public List<Notification> listAll(String userEmail) {
            return repository.findByCreatedBy(userEmail);
        }

        public List<Notification> listByType(String userEmail, NotificationType type) {
            return repository.findByCreatedByAndType(userEmail, type);
        }

        public void deleteOldNotifications(String userEmail) {
            LocalDate threshold = LocalDate.now().minusDays(30);
            repository.deleteByGenerationDateBeforeAndCreatedBy(threshold, userEmail);
        }

        }
