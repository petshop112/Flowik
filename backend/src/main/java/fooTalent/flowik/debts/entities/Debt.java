package fooTalent.flowik.debts.entities;


import fooTalent.flowik.clients.entities.Client;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.debts.enums.StatusDebt;
import fooTalent.flowik.payments.entities.Payment;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "debt")
public class Debt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creationDate")
    @CreationTimestamp
    private LocalDate debt_date;

    @Column(precision = 10, scale = 2)
    private BigDecimal mount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "debt", cascade = CascadeType.ALL)
    private List<Payment> payments = new ArrayList<>();

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusDebt status;

    @Column(name = "isActive")
    private boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false, updatable = false, length = 150)
    private String createdBy;

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
}
