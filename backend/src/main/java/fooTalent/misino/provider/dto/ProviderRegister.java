package fooTalent.misino.provider.dto;

import fooTalent.misino.validation.OnlyLettersAndSpaces;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProviderRegister(

        @NotBlank(message = "El nombre del proveedor es obligatorio.")
        @Size(min = 2, max = 50, message = "El Nombre del Proveedor debe tener entre 2 y 50 caracteres")
        @OnlyLettersAndSpaces
        String name_provider,

        @NotBlank(message = "La dirección del proveedor es obligatoria.")
        @Size(min = 10, max = 100, message = "La Direccion del Proveedor debe tener entre 10 y 100 caracteres")
        @OnlyLettersAndSpaces
        String direction_provider,

        @Pattern(regexp = "^\\+?\\d[\\d\\s]{7,20}$",
                message = "El número telefónico debe estar en formato internacional E.164, por ejemplo: +5491112345678")
        String telephone_provider,

        @NotBlank(message = "La descripción del proveedor es obligatoria.")
        @Size(min = 10, max = 300, message = "El Nombre del Proveedor debe tener entre 10 y 300 caracteres")
        @OnlyLettersAndSpaces
        String provider_description
){
}