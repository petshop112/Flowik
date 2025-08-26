package fooTalent.flowik.providers.dto;

import fooTalent.flowik.validations.ValidAddress;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProviderRegister(

        @NotBlank(message = "El nombre del proveedor es obligatorio.")
        @Size(min = 2, max = 50, message = "El Nombre del Proveedor debe tener entre 2 y 50 caracteres")
        String name_provider,

        @NotBlank(message = "El CUIT del proveedor es obligatorio"+
                "El CUIT recibe solo numeros")
        @Pattern(regexp = "^[0-9]{11}$", message = "Debe contener exactamente 11 dígitos numéricos")
        String cuit_provider,

        @Size(min = 10, max = 100, message = "La Direccion del Proveedor debe tener entre 10 y 100 caracteres")
        @ValidAddress
        String direction_provider,

        @NotBlank(message = "El campo telefono es obligatorio")
        @Pattern(regexp = "^[0-9]{7,20}$",
                message = "El número telefónico recibe solo numeros")
        @Schema(example = "1122334455")
        String telephone_provider,

        @Pattern(regexp = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$", message = "Correo de Cliente invalido")
        @NotBlank(message = "La dirección del Correo Electronico del Cliente es obligatoria.")
        @Schema(example = "cliente@email.com")
        String email_provider,

        @NotBlank(message = "La categoria del proveedor es obligatoria.")
        @Size(min = 10, max = 300, message = "la categoria del Proveedor debe tener entre 10 y 300 caracteres")
        String category_provider
){
}