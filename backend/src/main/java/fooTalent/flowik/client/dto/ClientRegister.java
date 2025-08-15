package fooTalent.flowik.client.dto;

import fooTalent.flowik.validation.OnlyLettersAndSpaces;
import jakarta.validation.constraints.*;


import java.time.LocalDate;


public record ClientRegister(
        @NotBlank(message = "El nombre del Client es obligatorio.")
        @Size(min = 2, max = 50, message = "El Nombre del Cliente debe tener entre 2 y 50 caracteres")
        @OnlyLettersAndSpaces
        String name_client,

        @NotBlank(message = "El tipo de Documento del Cliente es obligatorio.")
        @Size(min = 2, max = 50, message = "El Nombre del Cliente debe tener entre 2 y 50 caracteres")
        @OnlyLettersAndSpaces
        String document_type,

        //@Pattern(regexp = "^\\+?\\d[\\d\\s]{7,20}$",
        //        message = "El número telefónico debe estar en formato internacional E.164, por ejemplo: +5491112345678")
        Long telephone_client,

        @NotBlank(message = "La dirección del Cliente es obligatoria.")
        @Size(min = 10, max = 100, message = "La Direccion del Cliente debe tener entre 10 y 100 caracteres")
        String direction_provider,

        @Pattern(regexp = "^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$",message = "Correo de Cliente invalido")
        @NotBlank(message = "La dirección del Correo Electronico del Cliente es obligatoria.")
        String emil_client,

        //@NotBlank(message = "La Fecha de ingreso del Cliente obligatoria.")
        //@Past
        //@Date(pattern = "dd-MM-yyyy")

        LocalDate ingress_date,

        //@NotBlank(message = "La Deuda del Cliente es un campo obligatorio.")
        //@DecimalMin(value = "0.01", inclusive = true, message = "El precio debe ser mayor o igual a 0.01.")
       // @Digits(integer = 10,fraction = 2)
        Integer dedb_client,

        Boolean isactive
        )
{
}
