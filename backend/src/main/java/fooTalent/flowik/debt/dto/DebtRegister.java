package fooTalent.flowik.debt.dto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record DebtRegister(

        @NotBlank(message = "Deuda del Cliente ")
        @DecimalMin(value = "0.01", inclusive = true, message = "La Deuda debe ser mayor o igual a 0.01.")
        @Digits(integer = 10,fraction = 2)
        BigDecimal mount

) {

}
