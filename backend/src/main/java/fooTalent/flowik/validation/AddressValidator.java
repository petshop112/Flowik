package fooTalent.flowik.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AddressValidator implements ConstraintValidator<ValidAddress, String> {

    private static final String REGEX = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s]+$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return false;
        }
        return value.matches(REGEX);
    }
}