package fooTalent.misino.products.dto;

import fooTalent.misino.products.entity.Product;

public record ProductResponse(

        Long id,
        String title,
        Double price,
        String description,
        String category,
        String image
) {
    public ProductResponse(Product p) {
        this(
                (p != null) ? p.getId() : null,
                (p != null) ? p.getTitle() : null,
                (p != null) ? p.getPrice() : null,
                (p != null) ? p.getDescription() : null,
                (p != null) ? p.getCategory() : null,
                (p != null) ? p.getImage() : null
        );
    }
}
