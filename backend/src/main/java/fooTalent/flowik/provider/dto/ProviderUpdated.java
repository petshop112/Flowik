package fooTalent.flowik.provider.dto;

import fooTalent.flowik.validation.OnlyLettersAndSpaces;
import fooTalent.flowik.validation.ValidAddress;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProviderUpdated(

        @Size(min = 2, max = 50, message = "El Nombre del Proveedor debe tener entre 2 y 50 caracteres")
        String name_provider,

        @Pattern(regexp = "^[0-9]{11}$", message = "El CUIT debe contener exactamente 11 dígitos numéricos")
        String cuit_provider,

        @Size(min = 10, max = 100, message = "La Direccion del Proveedor debe tener entre 10 y 100 caracteres")
        @ValidAddress
        String direction_provider,

        @Pattern(regexp = "^[0-9]{7,20}$",
                message = "El número telefónico recibe solo numeros")
        @Schema(example = "1122334455")
        String telephone_provider,

        @Pattern(regexp = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$", message = "Correo de Cliente invalido")
        @Schema(example = "cliente@email.com")
        String email_provider,

        @Size(min = 10, max = 300, message = "La categoria del Proveedor debe tener entre 10 y 50 caracteres")
        String category_provider
){
}