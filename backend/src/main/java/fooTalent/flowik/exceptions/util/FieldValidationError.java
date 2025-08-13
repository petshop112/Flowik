package fooTalent.flowik.exceptions.util;

public record FieldValidationError(
        String field,
        String message
) {
}
