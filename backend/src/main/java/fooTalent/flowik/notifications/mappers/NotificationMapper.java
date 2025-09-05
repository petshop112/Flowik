package fooTalent.flowik.notifications.mappers;

import fooTalent.flowik.notifications.dto.NotificationDto;
import fooTalent.flowik.notifications.entities.Notification;

public class NotificationMapper {

    public static NotificationDto.NotificationDTO toDTO(Notification notification) {
        return NotificationDto.NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .description(notification.getDescription())
                .generationDate(notification.getGenerationDate())
                .read(notification.isReadNotification())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .build();
    }
}
