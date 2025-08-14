package fooTalent.misino.clientdedb.dto;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

public record Dedbregister(
        @NotBlank(message = "La Fecha de ingreso del Cliente obligatoria.")
        @Past
        @DateTimeFormat(pattern = "dd-MM-yyyy")
        Date dedb_date,
        @NotBlank(message = "La Deuda del Cliente es un campo obligatorio.")
        @DecimalMin(value = "0.01", inclusive = true, message = "El Deuda debe ser mayor o igual a 0.01.")
        @Digits(integer = 10,fraction = 2)
        BigDecimal dedb_client,
        @NotBlank(message = "La Monto del Cliente es un campo obligatorio.")
        @DecimalMin(value = "0.01", inclusive = true, message = "El Monto debe ser mayor o igual a 0.01.")
        @Digits(integer = 10,fraction = 2)
        BigDecimal mount,
        Boolean isactive
) {

}
