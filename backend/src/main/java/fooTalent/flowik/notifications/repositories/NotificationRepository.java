package fooTalent.flowik.notifications.repositories;

import fooTalent.flowik.notifications.entities.Notification;
import fooTalent.flowik.notifications.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByCreatedBy(String createdBy);

    List<Notification> findByCreatedByAndType(String createdBy, NotificationType type);

    Optional<Notification> findByIdAndCreatedBy(Long id, String createdBy);

    boolean existsByReferenceIdAndCreatedByAndTitle(Long productId, String userEmail, String type);

    void deleteByGenerationDateBefore(LocalDate threshold);

    boolean existsByReferenceIdAndCreatedByAndTitleAndTypeAndReadNotificationIsFalse(Long debtId, String createdBy, String title, NotificationType notificationType);
}