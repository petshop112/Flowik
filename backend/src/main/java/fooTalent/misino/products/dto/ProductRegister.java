package fooTalent.misino.products.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductRegister(

        @NotBlank(message = "El nombre del producto es obligatorio.")
        String title,

        @NotNull(message = "El precio no puede ser nulo.")
        @DecimalMin(value = "0.01", inclusive = true, message = "El precio debe ser mayor o igual a 0.01.")
        @Digits(integer = 10, fraction = 2, message = "El precio debe tener hasta 10 dígitos enteros y 2 decimales.")
        BigDecimal price,

        @NotBlank(message = "La descripción del producto es obligatorio.")
        String description,

        @NotNull(message = "La categoría del producto no puede ser nula.")
        @NotBlank(message = "La categoría del producto es obligatoria.")
        String category,

        @Pattern(regexp = "^(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|png)$", message = "La URL de la imagen no es válida.")
        String image
){
}