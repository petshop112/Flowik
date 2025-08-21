package fooTalent.flowik.products.entity;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.products.dto.ProductRegister;
import fooTalent.flowik.products.dto.ProductUpdated;

import fooTalent.flowik.provider.entity.Provider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "buy_date")
    private LocalDate buyDate;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = true, length = 255)
    private String description;

    @Column(nullable = false)
    private int amount;

    @Column(nullable = false, precision = 10, scale = 2, name = "sell_price")
    private BigDecimal sellPrice;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, name = "is_active")
    private boolean isActive;

    @ManyToMany
    @JoinTable(
            name = "product_provider",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "provider_id")
    )
    private List<Provider> providers = new ArrayList<>();

    @Column(nullable = false, updatable = false, length = 150)
    private String createdBy;

    @PrePersist
    public void prePersist() {
        this.createdBy = SecurityUtil.getAuthenticatedEmail();
    }

    public Product(ProductRegister p, List<Provider> providers) {
        this.buyDate = LocalDate.now();
        this.name = p.name();
        this.description = p.description();
        this.amount = p.amount();
        this.sellPrice = p.sellPrice();
        this.category = p.category();
        this.isActive = true;
        this.providers = providers;
    }

    public void updateProduct(ProductUpdated p, List<Provider> providersNew) {
        if (p.name() != null && !p.name().isBlank()) {
            this.name = p.name();
        }
        if (p.description() != null && !p.description().isBlank()) {
            this.description = p.description();
        }
        if (p.category() != null && !p.category().isBlank()) {
            this.category = p.category();
        }
        if (p.amount() != null && p.amount() > 0) {
            this.amount = p.amount();
        }
        if (p.sellPrice() != null && p.sellPrice().compareTo(BigDecimal.ZERO) > 0) {
            this.sellPrice = p.sellPrice();
        }
        if (providersNew != null && !providersNew.isEmpty()) {
            this.providers = providersNew;
        }
    }
}