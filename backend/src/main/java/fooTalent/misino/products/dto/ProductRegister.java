package fooTalent.misino.products.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRegister(

        @NotBlank(message = "El nombre del producto es obligatorio.")
        String title,

        @DecimalMin(value = "0.01", message = "El valor del producto debe ser mayor a 0.")
        Double price,

        @NotBlank(message = "El nombre del producto es obligatorio.")
        String description,

        @NotNull(message = "La cantidad del producto no puede ser nula.")
        String category,

        String image
){
}