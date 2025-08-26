package fooTalent.flowik.debts.dto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DebtRegister(

        @NotNull(message = "Deuda del Cliente ")
        @DecimalMin(value = "0.01", inclusive = true, message = "La Deuda debe ser mayor o igual a 0.01.")
        @Digits(integer = 10,fraction = 2)
        BigDecimal mount

) {
}
