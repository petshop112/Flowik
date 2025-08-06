package fooTalent.misino.products.dto;

import fooTalent.misino.products.entity.Product;

import java.math.BigDecimal;

public record ProductList(

        Long id,
        String title,
        BigDecimal price,
        String description,
        String category,
        String image
) {
    public ProductList(Product p) {
        this(
                p.getId(),
                p.getTitle(),
                p.getPrice(),
                p.getDescription(),
                p.getCategory(),
                p.getImage()
        );
    }
}