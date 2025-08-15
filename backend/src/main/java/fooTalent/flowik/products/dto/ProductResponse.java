package fooTalent.flowik.products.dto;

import fooTalent.flowik.products.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProductResponse(

        Long id,
        String name,
        String description,
        String category,
        List<String> supplierNames,
        Integer amount,
        Double weigth,
        BigDecimal sellPrice,
        LocalDate buyDate,
        LocalDate expiration
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
                (p != null) ? p.getSellPrice() : null,
                (p != null) ? p.getBuyDate() : null,
                (p != null) ? p.getExpiration() : null
        );
    }
}