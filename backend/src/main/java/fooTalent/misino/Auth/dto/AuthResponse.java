package fooTalent.misino.Auth.dto;

public record AuthResponse(
        String token,
        String message,
        boolean success
) {}