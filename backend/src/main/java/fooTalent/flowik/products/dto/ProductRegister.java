package fooTalent.flowik.products.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProductRegister(

        @NotNull(message = "El nombre del producto no puede ser nulo.")
        @NotBlank(message = "El nombre del producto es obligatorio.")
        @Size(min = 3, max = 50, message = "El nombre del producto debe tener entre 2 y 50 caracteres.")
        String name,

        @NotNull(message = "La descripción del producto es obligatoria.")
        @Size(min = 10, max = 255, message = "La descripción del producto debe tener entre 10 y 255 caracteres.")
        String description,

        @NotNull(message = "La categoría del producto no puede ser nula.")
        @NotBlank(message = "La categoría del producto es obligatoria.")
        @Size(min = 3, max = 50, message = "La categoría del producto debe tener entre 3 y 50 caracteres.")
        String category,

        @NotNull(message = "El/Los IDs del/los proveedor/es es/son obligatorio/s.")
        List<Long> providerIds,

        @NotNull(message = "El stock del producto no puede ser nulo.")
        @Min(value = 0, message = "La cantidad debe ser mayor o igual a 0.")
        Integer amount,

        @Nullable
//        @NotNull(message = "El peso del producto es obligatorio.")
        @DecimalMin(value = "0.01", inclusive = true, message = "El peso del producto debe ser mayor o igual a 0.01.")
        Double weight,

        @NotNull(message = "El precio del producto es obligatorio.")
        @DecimalMin(value = "0.00", inclusive = true, message = "El precio debe ser mayor o igual a 0.00.")
        @Digits(integer = 10, fraction = 2, message = "El precio debe tener hasta 10 dígitos enteros y 2 decimales.")
        BigDecimal sellPrice,

        @Nullable
//        @NotNull(message = "El fecha de vencimiento del producto es obligatoria.")
        @FutureOrPresent(message = "La fecha de compra no puede ser una fecha pasada.")
        LocalDate expiration

        // Se habilitará en futuras versiones
//        @Pattern(regexp = "^(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|png)$", message = "La URL de la imagen no es válida.")
//        String image;
){
}