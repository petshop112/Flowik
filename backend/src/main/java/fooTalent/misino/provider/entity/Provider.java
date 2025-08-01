package fooTalent.misino.provider.entity;
import fooTalent.misino.provider.dto.ProviderRegister;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
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

    @Column(nullable = false, length = 50)
    private String provider_description;

    public Provider(ProviderRegister pr){
        this.name_provider = pr.name_provider();
        this.direction_provider = pr.direction_provider();
        this.telephone_provider = pr.telephone_provider();
        this.provider_description = pr.provider_description();
    }
}
