package fooTalent.flowik.client.dto;

import fooTalent.flowik.validation.OnlyLettersAndSpaces;
import fooTalent.flowik.validation.ValidAddress;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record ClientRegister(
        @NotBlank(message = "El nombre del Client es obligatorio.")
        @Size(min = 2, max = 50, message = "El Nombre del Cliente debe tener entre 2 y 50 caracteres")
        @OnlyLettersAndSpaces
        String name_client,

        @NotBlank(message = "El tipo de Documento del Cliente es obligatorio.")
        @Size(min = 2, max = 50, message = "El Nombre del Cliente debe tener entre 2 y 50 caracteres")
        String document_type,

        @Pattern(regexp = "^[0-9]{7,20}$",
        message = "El número telefónico recibe solo numeros")
        @Schema(example = "1122334455")
        String telephone_client,

        @NotBlank(message = "La dirección del Cliente es obligatoria.")
        @Size(min = 10, max = 100, message = "La Direccion del Cliente debe tener entre 10 y 100 caracteres")
        @Schema(example = "Calle Falsa 123")
        @ValidAddress
        String direction_client,

        @Pattern(regexp = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$", message = "Correo de Cliente invalido")
        @NotBlank(message = "La dirección del Correo Electronico del Cliente es obligatoria.")
        @Schema(example = "cliente@email.com")
        String email_client
       )
{
}
