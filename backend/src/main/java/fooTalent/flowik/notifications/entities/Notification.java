package fooTalent.flowik.notifications.entities;

import fooTalent.flowik.notifications.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Builder
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;

    @Column(name = "generation_date")
    private LocalDate generationDate;
    private boolean readNotification;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "created_by")
    private String createdBy;

    @PrePersist
    public void prePersist() {
        this.generationDate = LocalDate.now();
    }
}