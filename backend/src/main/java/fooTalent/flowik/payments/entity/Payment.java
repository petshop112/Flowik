package fooTalent.flowik.payments.entity;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.debt.entity.Debt;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,name = "payment_mount", precision = 10, scale = 2)
    private BigDecimal paymentMount;

    @Column(name = "datePayment", updatable = false)
    @CreationTimestamp
    private LocalDate datePayment;

    @Column(nullable = false, updatable = false, length = 150)
    private String createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debt_id", nullable = false)
    private Debt debt;

    @PrePersist
    public void prePersist() {
        this.createdBy = SecurityUtil.getAuthenticatedEmail();
    }
}
