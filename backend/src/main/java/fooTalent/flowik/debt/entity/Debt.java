package fooTalent.flowik.debt.entity;


import fooTalent.flowik.debt.enums.StatusDebt;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    @Column()
    private BigDecimal payment = BigDecimal.ZERO;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusDebt status;

    @Column(name = "isActive")
    private boolean isActive;

    public boolean getIsActive() {
        return isActive;
    }
    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
}
