package fooTalent.flowik.providers.entities;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.providers.dto.ProviderRegister;
import fooTalent.flowik.providers.dto.ProviderUpdated;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "provider")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_provider;

    @Column(nullable = false, length = 50)
    private String name_provider;

    @Column(nullable = false, length = 25, unique = true)
    private String cuit_provider;

    @Column(length = 100)
    private String direction_provider;

    @Column(nullable = false, length = 20)
    private String telephone_provider;

    @Column(nullable = false)
    private String email_provider;

    @Column(nullable = false, length = 300)
    private String category_provider;

    @ManyToMany(mappedBy = "providers")
    private List<Product> products = new ArrayList<>();

    @Column(nullable = false, updatable = false, length = 150)
    private String createdBy;

    @Column(nullable = false)
    private boolean isActive;

    @PrePersist
    public void prePersist() {
        this.createdBy = SecurityUtil.getAuthenticatedEmail();
        this.isActive = true;
    }

    public Provider(ProviderRegister dto) {
        this.name_provider = dto.name_provider();
        this.cuit_provider = dto.cuit_provider();
        this.direction_provider = dto.direction_provider();
        this.telephone_provider = dto.telephone_provider();
        this.email_provider = dto.email_provider();
        this.category_provider = dto.category_provider();
    }

}