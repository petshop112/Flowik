package fooTalent.misino.provider.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ProviderRegister(

        @NotBlank(message = "El nombre del proveedor es obligatorio.")
        String name_provider,

        @NotBlank(message = "La dirección del proveedor es obligatoria.")
        String direction_provider,

        @Pattern(regexp = "^\\+?\\d[\\d\\s]{7,20}$",
                 message = "El número telefónico debe estar en formato internacional E.164, por ejemplo: +5491112345678")
        String telephone_provider,

        @NotBlank(message = "La descripción del proveedor es obligatoria.")
        String provider_description
){
}