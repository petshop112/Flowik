package fooTalent.flowik.provider.entity;
import fooTalent.flowik.products.entity.Product;
import fooTalent.flowik.provider.dto.ProviderRegister;
import fooTalent.flowik.provider.dto.ProviderUpdated;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "provider")
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_provider;

    @Column(nullable = false, length = 50)
    private String name_provider;

    @Column(nullable = false, length = 100)
    private String direction_provider;

    @Column(nullable = false, length = 20)
    private String telephone_provider;

    @Column(nullable = false, length = 300)
    private String provider_description;

    @ManyToMany(mappedBy = "providers")
    private List<Product> products = new ArrayList<>();

    public Provider(ProviderRegister pr){
        this.name_provider = pr.name_provider();
        this.direction_provider = pr.direction_provider();
        this.telephone_provider = pr.telephone_provider();
        this.provider_description = pr.provider_description();
    }

    public void updateFromDto(ProviderUpdated dto) {
        if (dto.name_provider() != null) {
            this.name_provider = dto.name_provider();
        }
        if (dto.direction_provider() != null) {
            this.direction_provider = dto.direction_provider();
        }
        if (dto.telephone_provider() != null) {
            this.telephone_provider = dto.telephone_provider();
        }
        if (dto.provider_description() != null) {
            this.provider_description = dto.provider_description();
        }
    }


}
