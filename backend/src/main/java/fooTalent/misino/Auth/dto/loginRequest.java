package fooTalent.misino.Auth.dto;

import jakarta.validation.constraints.NotBlank;

public record loginRequest(
        @NotBlank(message = "El campo email no puede estar vacío")
        String email,
        @NotBlank(message = "El campo contraseña no puede estar vacío")
        String password
) {}