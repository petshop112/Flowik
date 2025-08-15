package fooTalent.flowik.client.dto;

import fooTalent.flowik.validation.OnlyLettersAndSpaces;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record ClientUpdate(
        @Size(min = 2, max = 50, message = "El Nombre del Cliente debe tener entre 2 y 50 caracteres")
        @OnlyLettersAndSpaces
        String name_client,

        @Size(min = 2, max = 50, message = "El tipo de documento del Cliente debe tener entre 2 y 50 caracteres")
        String document_type,

        @Pattern(regexp = "^[0-9]{7,20}$",
                message = "El número telefónico recibe solo numeros")
        @Schema(example = "1122334455")
        String telephone_client,

        @Size(min = 10, max = 100, message = "La Direccion del Cliente debe tener entre 10 y 100 caracteres")
        @Schema(example = "Calle Falsa 123")
        String direction_client,

        @Pattern(
                regexp = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$",
                message = "Correo de Cliente invalido"
        )
        @Schema(example = "cliente@email.com")
        String email_client,

        @DecimalMin(value = "0.01", inclusive = true, message = "El precio debe ser mayor o igual a 0.01.")
        @Digits(integer = 10,fraction = 2)
        @Schema(example = "100")
        Integer dedb_client
) {}