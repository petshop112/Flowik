package fooTalent.flowik.products.entity;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.products.dto.ProductRegister;
import fooTalent.flowik.products.dto.ProductUpdated;

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
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "buy_date")
    private LocalDate buyDate;

    @Column(nullable = true)
    private LocalDate expiration;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = true, length = 255)
    private String description;

    @Column(nullable = true)
    private double weigth;

    @Column(nullable = false)
    private int amount;

    @Column(nullable = false, precision = 10, scale = 2, name = "sell_price")
    private BigDecimal sellPrice;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, name = "is_active")
    private boolean isActive;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "products_supplier",
                     joinColumns = @JoinColumn(name = "id")
    )
    private List<String> supplierNames = new ArrayList<>();

    @Column(nullable = false, updatable = false, length = 150)
    private String createdBy;

    @PrePersist
    public void prePersist() {
        this.createdBy = SecurityUtil.getAuthenticatedEmail();
    }

    public Product(ProductRegister p, List<String> supplierNames) {
        this.buyDate = LocalDate.now();
        this.expiration = p.expiration();
        this.name = p.name();
        this.description = p.description();
        this.weigth = p.weight();
        this.amount = p.amount();
        this.sellPrice = p.sellPrice();
        this.category = p.category();
        this.isActive = true;
        this.supplierNames = supplierNames;
    }

    public void updateProduct(ProductUpdated p, List<String> supplierNamesNew) {
        if(p.expiration() != null) this.expiration = p.expiration();
        if(p.name() != null) this.name = p.name();
        if(p.description() != null) this.description = p.description();
        if(p.weight() != null) this.weigth = p.weight();
        if(p.amount() != null) this.amount = p.amount();
        if(p.sellPrice() != null) this.sellPrice = p.sellPrice();
        if(!supplierNamesNew.isEmpty()) this.supplierNames = supplierNamesNew;
    }
}