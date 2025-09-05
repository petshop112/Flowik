package fooTalent.flowik.auth.dto;

public record AuthResponse(
        String token,
        String message,
        boolean success
) {}