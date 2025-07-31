package fooTalent.misino.products.entity;

import fooTalent.misino.products.dto.ProductRegister;
import fooTalent.misino.products.dto.ProductUpdated;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, length = 150)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String image;

    public Product(ProductRegister p) {
        this.title = p.title();
        this.price = p.price();
        this.description = p.description();
        this.category = p.category();
        this.image = p.image();
    }

    public void updateProduct(ProductUpdated p) {
        if(p.title() != null) this.title = p.title();
        if(p.price() != null) this.price = p.price();
        if(p.description() != null) this.description = p.description();
        if(p.category() != null) this.category = p.category();
        if(p.image() != null) this.image = p.image();
    }
}