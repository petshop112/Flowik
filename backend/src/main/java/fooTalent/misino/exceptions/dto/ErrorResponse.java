package fooTalent.misino.exceptions.dto;

import fooTalent.misino.exceptions.util.FieldValidationError;

import java.util.List;

public record ErrorResponse(
        int status,
        String error,
        String message,
        List<FieldValidationError> fieldErrors
) {
}
