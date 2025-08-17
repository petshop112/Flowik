package fooTalent.flowik.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = AddressValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidAddress {
    String message() default "La dirección solo puede contener letras, números y espacios.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}