package fooTalent.flowik.products.dto;

import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.providers.entities.Provider;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProductList(

        Long id,
        String name,
        String category,
        Integer amount,
        BigDecimal sellPrice,
        LocalDate buyDate,
        List<String> providers,
        boolean isActive
) {
    public ProductList(Product p) {
        this(
                p.getId(),
                p.getName(),
                p.getCategory(),
                p.getAmount(),
                p.getSellPrice(),
                p.getBuyDate(),
                p.getProviders()
                        .stream()
                        .map(Provider::getName_provider)
                        .toList(),
                p.isActive()
        );
    }
}