package fooTalent.misino.Auth.util;

import fooTalent.misino.users.entity.user;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class verificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne
    private user user;

    private LocalDateTime expiryDate;
}