package fooTalent.misino.Auth.util;


import fooTalent.misino.Auth.dto.authResponse;
import fooTalent.misino.users.entity.user;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class userValidation {

    private static final Pattern EMAIL_REGEX = Pattern.compile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$");
    private static final String PASSWORD_REGEX = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$";

    public authResponse validate(user user) {

        if (user.getEmail() == null || !EMAIL_REGEX.matcher(user.getEmail()).matches()) {
            return new authResponse(null, "El email no tiene formato válido", false);
        }

        if (user.getPassword() == null || !user.getPassword().matches(PASSWORD_REGEX)) {
            return new authResponse(null, "La contraseña debe tener entre 8 y 16 caracteres, al menos un número, una minúscula y una mayúscula.", false);
        }

        return new authResponse(null, "Validación exitosa", true);
    }

    public authResponse validatePassword(String password) {
        if (password == null || !password.matches(PASSWORD_REGEX)) {
            return new authResponse(null, "La contraseña debe tener entre 8 y 16 caracteres, al menos un número, una minúscula y una mayúscula.", false);
        }
        return new authResponse(null, "Validación exitosa", true);
    }
    public authResponse validateName(String name, String campo) {
        if (name == null || name.trim().isEmpty()) {
            return new authResponse(null, campo + " no puede estar vacío.", false);
        }

        if (name.length() < 2 || name.length() > 50) {
            return new authResponse(null, campo + " debe tener entre 2 y 50 caracteres.", false);
        }

        if (!name.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
            return new authResponse(null, campo + " solo puede contener letras y espacios.", false);
        }

        return new authResponse(null, "Validación exitosa", true);
    }
}