package fooTalent.flowik.notifications.controller;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.notifications.dto.NotificationDto;
import fooTalent.flowik.notifications.entities.Notification;
import fooTalent.flowik.notifications.enums.NotificationType;
import fooTalent.flowik.notifications.mappers.NotificationMapper;
import fooTalent.flowik.notifications.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

        @Autowired
        private NotificationService service;

    @Operation(summary = "Obtener todas las notificaciones")
    @GetMapping
    public List<NotificationDto.NotificationDTO> getAllNotifications() {
        String userEmail = SecurityUtil.getAuthenticatedEmail();

        List<Notification> allNotifications = service.listAll();

        return allNotifications.stream()
                .filter(notification -> notification.getCreatedBy().equals(userEmail))
                .map(NotificationMapper::toDTO)
                .collect(Collectors.toList());
    }

        @Operation(summary = "filtrar las notificaciones por Stock o Deudas")
        @GetMapping("/type/{type}")
        public List<NotificationDto.NotificationDTO> getNotificationsByType(@PathVariable NotificationType type) {
            String user = SecurityUtil.getAuthenticatedEmail();
            return service.listByType(user, type).stream()
                    .map(NotificationMapper::toDTO)
                    .collect(Collectors.toList());
        }

        @Operation(summary = "Leer notificaciones por id")
        @PostMapping("/read/{id}")
        public void markNotificationAsRead(@PathVariable Long id) {
            String user = SecurityUtil.getAuthenticatedEmail();
            service.markAsRead(id, user);
        }
}

