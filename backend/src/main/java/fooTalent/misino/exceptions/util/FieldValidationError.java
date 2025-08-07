package fooTalent.misino.exceptions.util;

public record FieldValidationError(
        String field,
        String message
) {
}
