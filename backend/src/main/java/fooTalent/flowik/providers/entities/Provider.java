package fooTalent.flowik.providers.entities;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.providers.dto.ProviderRegister;
import fooTalent.flowik.providers.dto.ProviderUpdated;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "provider")
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_provider;

    @Column(nullable = false, length = 50)
    private String name_provider;

    @Column(nullable = false, length = 25)
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


    @PrePersist
    public void prePersist() {
        this.createdBy = SecurityUtil.getAuthenticatedEmail();
    }

    public Provider(ProviderRegister dto) {
        this.name_provider = dto.name_provider();
        this.cuit_provider = dto.cuit_provider();
        this.direction_provider = dto.direction_provider();
        this.telephone_provider = dto.telephone_provider();
        this.email_provider = dto.email_provider();
        this.category_provider = dto.category_provider();
    }

     public void updateFromDto(ProviderUpdated dto) {
        if (dto.name_provider() != null) {
            this.name_provider = dto.name_provider();
        }
        if (dto.cuit_provider() != null){
            this.cuit_provider = dto.cuit_provider();
        }
        if (dto.direction_provider() != null) {
            this.direction_provider = dto.direction_provider();
        }
        if (dto.telephone_provider() != null) {
            this.telephone_provider = dto.telephone_provider();
        }
        if (dto.email_provider() != null){
            this.email_provider = dto.email_provider();
        }
        if (dto.category_provider() != null) {
            this.category_provider = dto.category_provider();
        }
    }



}
