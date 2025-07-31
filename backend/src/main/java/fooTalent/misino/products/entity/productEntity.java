package fooTalent.misino.products.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@RequiredArgsConstructor
@Data
public class productEntity {
    @Id
    private Long id;
    @Column(nullable = false)
    private String nameProduct;
}
