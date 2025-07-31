package fooTalent.misino.Auth.dto;

public record authResponse(
        String token,
        String message,
        boolean success
) {}