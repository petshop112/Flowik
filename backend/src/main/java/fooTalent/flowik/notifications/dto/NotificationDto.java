package fooTalent.flowik.notifications.dto;

import lombok.*;
import  fooTalent.flowik.notifications.enums.NotificationType;

import java.time.LocalDate;
public class NotificationDto {



    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationDTO {
        private Long id;
        private String title;
        private String description;
        private LocalDate generationDate;
        private boolean read;
        private NotificationType type;
        private Long referenceId;
    }

}
