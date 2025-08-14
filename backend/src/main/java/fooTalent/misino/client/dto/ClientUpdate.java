package fooTalent.misino.client.dto;

import fooTalent.misino.validation.OnlyLettersAndSpaces;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record ClientUpdate   (
    @NotBlank(message = "El nombre del Client es obligatorio.")
    @Size(min = 2, max = 50, message = "El Nombre del Cliente debe tener entre 2 y 50 caracteres")
    @OnlyLettersAndSpaces
    String name_client,

    @NotBlank(message = "El tipo de Documento del Cliente es obligatorio.")
    @Size(min = 2, max = 50, message = "El Nombre del Cliente debe tener entre 2 y 50 caracteres")
    @OnlyLettersAndSpaces
    String document_type,

    @Pattern(regexp = "^\\+?\\d[\\d\\s]{7,20}$",
            message = "El número telefónico debe estar en formato internacional E.164, por ejemplo: +5491112345678")
    Long telephone_client,

    @NotBlank(message = "La dirección del Cliente es obligatoria.")
    @Size(min = 10, max = 100, message = "La Direccion del Cliente debe tener entre 10 y 100 caracteres")
    @OnlyLettersAndSpaces
    String direction_client,

    @Pattern(regexp = "^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$",message = "Correo de Cliente invalido")
    @NotBlank(message = "La dirección del Correo Electronico del Cliente es obligatoria.")
    @Size(min = 10, max = 100, message = "La Direccion del Correo Electronicodel Cliente debe tener entre 6 y 100 caracteres")
    @OnlyLettersAndSpaces
    String emil_client,

    @NotBlank(message = "La Fecha de ingreso del Cliente obligatoria.")
    @Past
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    LocalDate ingress_date,

    int dedb_client
)
{
}