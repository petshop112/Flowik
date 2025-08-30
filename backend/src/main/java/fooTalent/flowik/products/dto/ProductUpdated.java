package fooTalent.flowik.products.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record ProductUpdated(


        String name,

        String description,

        String category,

        List<Long> providerIds,

        Integer amount,

        BigDecimal sellPrice
){
}