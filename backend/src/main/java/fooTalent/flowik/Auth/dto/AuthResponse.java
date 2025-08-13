package fooTalent.flowik.Auth.dto;

public record AuthResponse(
        String token,
        String message,
        boolean success
) {}