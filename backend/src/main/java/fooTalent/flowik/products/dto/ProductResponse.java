package fooTalent.flowik.products.dto;

import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.providers.entities.Provider;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        String category,
        List<String> providers,
        Integer amount,
        BigDecimal sellPrice,
        LocalDate buyDate,
        boolean isActive
) {
    public ProductResponse(Product p) {
        this(
                (p != null) ? p.getId() : null,
                (p != null) ? p.getName() : null,
                (p != null) ? p.getDescription() : null,
                (p != null) ? p.getCategory() : null,
                (p != null) ? p.getProviders().stream()
                        .map(Provider::getName_provider)
                        .toList() : null,
                (p != null) ? p.getAmount() : null,
                (p != null) ? p.getSellPrice() : null,
                (p != null) ? p.getBuyDate() : null,
                (p != null) ? p.isActive() : null
        );
    }
}