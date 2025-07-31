package fooTalent.misino.products.dto;

import fooTalent.misino.products.entity.Product;

public record ProductList(

        Long id,
        String title,
        Double price,
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
