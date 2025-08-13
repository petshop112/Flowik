package fooTalent.flowik.products.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductUpdated(

        @NotNull(message = "El nombre del producto no puede ser nulo.")
        @NotBlank(message = "El nombre del producto es obligatorio.")
        @Size(min = 3, max = 50, message = "El nombre del producto debe tener entre 2 y 50 caracteres.")
        String title,

        @NotNull(message = "El precio no puede ser nulo.")
        @DecimalMin(value = "0.01", inclusive = true, message = "El precio debe ser mayor o igual a 0.01.")
        @Digits(integer = 10, fraction = 2, message = "El precio debe tener hasta 10 dígitos enteros y 2 decimales.")
        BigDecimal price,

        @NotNull(message = "La descripción del producto es obligatoria.")
        @Size(min = 10, max = 255, message = "La descripción del producto debe tener entre 10 y 255 caracteres.")
        String description,

        @NotNull(message = "La categoría del producto no puede ser nula.")
        @NotBlank(message = "La categoría del producto es obligatoria.")
        @Size(min = 3, max = 50, message = "La categoría del producto debe tener entre 3 y 50 caracteres.")
        String category,

        // Se habilitará en futuras versiones
//        @Pattern(regexp = "^(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|png)$", message = "La URL de la imagen no es válida.")
        String image
){
}