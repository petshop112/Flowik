package fooTalent.misino.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

    public class OnlyLettersAndSpacesValidator implements ConstraintValidator<OnlyLettersAndSpaces, String> {

        private static final String REGEX = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$";

        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            if (value == null || value.trim().isEmpty()) {
                return false;
            }
            return value.matches(REGEX);
        }
    }

