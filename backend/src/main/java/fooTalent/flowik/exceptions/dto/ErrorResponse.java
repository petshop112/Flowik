package fooTalent.flowik.exceptions.dto;

import fooTalent.flowik.exceptions.util.FieldValidationError;

import java.util.List;

public record ErrorResponse(
        int status,
        String error,
        String message,
        List<FieldValidationError> fieldErrors
) {
}
