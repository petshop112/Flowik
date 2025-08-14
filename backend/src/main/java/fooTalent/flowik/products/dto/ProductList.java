package fooTalent.flowik.products.dto;

import fooTalent.flowik.products.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public record ProductList(

        Long id,
        String name,
        String category,
        Integer amount,
        BigDecimal sellPrice,
        Double weigth,
        LocalDate buyDate,
        LocalDate expiration,
        Set<String> supplierNames
) {
    public ProductList(Product p) {
        this(
                p.getId(),
                p.getName(),
                p.getCategory(),
                p.getAmount(),
                p.getSellPrice(),
                p.getWeigth(),
                p.getBuyDate(),
                p.getExpiration(),
                p.getSupplierNames()
        );
    }
}