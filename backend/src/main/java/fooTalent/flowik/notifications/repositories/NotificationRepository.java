package fooTalent.flowik.notifications.repositories;

import fooTalent.flowik.notifications.entities.Notification;
import fooTalent.flowik.notifications.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByCreatedBy(String createdBy);

    List<Notification> findByCreatedByAndType(String createdBy, NotificationType type);

    Optional<Notification> findByIdAndCreatedBy(Long id, String createdBy);

    @Modifying
    @Transactional
    void deleteByGenerationDateBeforeAndCreatedBy(LocalDate date, String createdBy);
}