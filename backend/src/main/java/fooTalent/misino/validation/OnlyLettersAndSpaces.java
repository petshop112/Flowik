package fooTalent.misino.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = OnlyLettersAndSpacesValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface OnlyLettersAndSpaces {
    String message() default "El campo solo puede contener letras y espacios.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}