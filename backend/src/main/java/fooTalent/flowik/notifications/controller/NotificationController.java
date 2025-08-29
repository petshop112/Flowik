package fooTalent.flowik.notifications.controller;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.notifications.dto.NotificationDto;
import fooTalent.flowik.notifications.enums.NotificationType;
import fooTalent.flowik.notifications.mappers.NotificationMapper;
import fooTalent.flowik.notifications.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

        @Autowired
        private NotificationService service;

        @GetMapping
        public List<NotificationDto.NotificationDTO> getAllNotifications() {
            String user = SecurityUtil.getAuthenticatedEmail();
            return service.listAll(user).stream()
                    .map(NotificationMapper::toDTO)
                    .collect(Collectors.toList());
        }

        @GetMapping("/type/{type}")
        public List<NotificationDto.NotificationDTO> getNotificationsByType(@PathVariable NotificationType type) {
            String user = SecurityUtil.getAuthenticatedEmail();
            return service.listByType(user, type).stream()
                    .map(NotificationMapper::toDTO)
                    .collect(Collectors.toList());
        }

        @PostMapping("/read/{id}")
        public void markNotificationAsRead(@PathVariable Long id) {
            String user = SecurityUtil.getAuthenticatedEmail();
            service.markAsRead(id, user);
        }
}

