package fooTalent.flowik.client.entity;


import fooTalent.flowik.client.dto.ClientRegister;
import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.debt.entity.Debt;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name= "client")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_client;

    @Column(nullable= false, length=100)
    private String name_client;

    @Column(nullable= false, length=50)
    private String document_type;

    @Column(nullable = false, length = 20)
    private String telephone_client;

    @Column(nullable = false, length = 150)
    private String direction_client;

    @Column(nullable = false, length = 150)
    private String email_client;

    @Column(name = "ingress_date", updatable = false)
    @CreationTimestamp
    private LocalDate ingress_date;

    @Column(name = "isActive")
    private boolean isActive;

    @Column(nullable = false, updatable = false, length = 150)
    private String createdBy;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Debt> debts = new ArrayList<>();

    public void changeStatus() {
        this.isActive = !isActive;
    }

   public boolean getIsActive() {
        return isActive;
    }
    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
    @PrePersist
    public void prePersist() {
        this.createdBy = SecurityUtil.getAuthenticatedEmail();
    }

    public Client(ClientRegister cr){
            this.name_client = cr.name_client();
            this.document_type = cr.document_type();
            this.telephone_client = cr.telephone_client();
            this.direction_client = cr.direction_client();
            this.email_client = cr.email_client();
            this.isActive = true;

    }

    public void updateFromDto(ClientUpdate dto) {
        if (dto.name_client() != null && !dto.name_client().isBlank()) {
            this.name_client = dto.name_client();
        }
        if (dto.document_type() != null && !dto.document_type().isBlank()) {
            this.document_type = dto.document_type();
        }
        if (dto.telephone_client() != null && !dto.telephone_client().isBlank()) {
            this.telephone_client = dto.telephone_client();
        }
        if (dto.direction_client() != null && !dto.direction_client().isBlank()) {
            this.direction_client = dto.direction_client();
        }
        if (dto.email_client() != null && !dto.email_client().isBlank()) {
            this.email_client = dto.email_client();
        }
    }
    }

