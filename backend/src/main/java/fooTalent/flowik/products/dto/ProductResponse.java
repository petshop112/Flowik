package fooTalent.flowik.products.dto;

import fooTalent.flowik.products.entity.Product;

import java.math.BigDecimal;

public record ProductResponse(

        Long id,
        String title,
        BigDecimal price,
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