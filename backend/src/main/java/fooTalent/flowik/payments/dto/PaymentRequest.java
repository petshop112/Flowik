package fooTalent.flowik.payments.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;

public record PaymentRequest(
        @DecimalMin(value = "0.01", inclusive = true, message = "El monto del pago debe ser mayor o igual a 0.01.")
        @Digits(integer = 10,fraction = 2)
        @Schema(example = "100.00")
        BigDecimal paymentMount
) {
}
