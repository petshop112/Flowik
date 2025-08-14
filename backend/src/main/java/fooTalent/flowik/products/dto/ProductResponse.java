package fooTalent.flowik.products.dto;

import fooTalent.flowik.products.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public record ProductResponse(

        Long id,
        String name,
        String description,
        String category,
        Set<String> supplierNames,
        Integer amount,
        Double weigth,
        LocalDate buyDate,
        LocalDate expiration,
        BigDecimal sellPrice
) {
    public ProductResponse(Product p) {
        this(
                (p != null) ? p.getId() : null,
                (p != null) ? p.getName() : null,
                (p != null) ? p.getDescription() : null,
                (p != null) ? p.getCategory() : null,
                (p != null) ? p.getSupplierNames() : null,
                (p != null) ? p.getAmount() : null,
                (p != null) ? p.getWeigth() : null,
                (p != null) ? p.getBuyDate() : null,
                (p != null) ? p.getExpiration() : null,
                (p != null) ? p.getSellPrice() : null
        );
    }
}