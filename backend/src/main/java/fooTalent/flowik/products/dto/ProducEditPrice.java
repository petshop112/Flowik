package fooTalent.flowik.products.dto;

import fooTalent.flowik.products.enums.AdjustType;
import fooTalent.flowik.products.enums.AdjustValue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.util.List;

public record ProducEditPrice(

        @DecimalMin(value = "0.00", inclusive = false, message = "El precio debe ser mayor que 0.00.")
        @Digits(integer = 10, fraction = 2, message = "El valor debe tener hasta 8 dígitos enteros y 2 decimales.")
        BigDecimal value,

        AdjustType adjustType,
        AdjustValue adjustValue,
        List<Long> IDs
) {
}