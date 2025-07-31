package fooTalent.misino.Auth.service;

import fooTalent.misino.Auth.dto.authResponse;
import fooTalent.misino.Auth.dto.loginRequest;
import fooTalent.misino.Auth.dto.registerRequest;
import fooTalent.misino.Auth.repositories.verificationTokenRepository;
import fooTalent.misino.Auth.util.userValidation;
import fooTalent.misino.users.entity.user;
import fooTalent.misino.users.repositories.userRepository;
import fooTalent.misino.Auth.util.emailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class authService {
    private final userRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final jwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final userValidation userValidation;
    private final verificationTokenRepository verificationTokenRepository;
    private final emailService emailService;

    @Value("${URL_FRONT}")
    private String frontUrl;
    @Value("${URL_BACK}")
    private String backUrl;

    public authResponse register(registerRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            return new authResponse(null, "Las contraseñas no coinciden.", false);
        }

        String fullName = request.firstName() + " " + request.lastName();

        user tempUser = new user();
        tempUser.setUserName(fullName);
        tempUser.setEmail(request.email());
        tempUser.setPassword(request.password());

        authResponse validationResponse = userValidation.validate(tempUser);
        if (!validationResponse.success()) {
            return validationResponse;
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            return new authResponse(null, "El email ya está registrado", false);
        }

        user user = new user();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUserName(fullName);
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiration(new Date(System.currentTimeMillis() + 86400000)); // Expira en 1 día
        user.setIsActive(false);

        userRepository.save(user);

        String link = backUrl + "/auth/verifyToken?token=" + verificationToken;
        emailService.sendEmail(user.getEmail(), "Verifica tu cuenta",
                "<p>Hola " + user.getUserName() + ",</p>" +
                        "<p>Gracias por registrarte en nuestra web app para controlar tu " +
                        "Petshop. Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>" +
                        "<a href=\"" + link + "\">Verificar cuenta</a>"
        );

        System.out.println("Token de verificación enviado: " + verificationToken);
        return new authResponse(null, "Usuario registrado exitosamente. Por favor verifica tu correo, " +
                "no olvides revisar tu casilla de spam", true);
    }

    public authResponse login(loginRequest request) {
        Optional<user> optionalUser = userRepository.findByEmail(request.email());
        if (optionalUser.isEmpty()) {
            return new authResponse(null, "Usuario no encontrado.", false);
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
        } catch (Exception e) {
            return new authResponse(null, "Contraseña incorrecta.", false);
        }

        user user = optionalUser.get();
        String jwt = jwtService.generateToken(user);

        return new authResponse(jwt, "Usuario autenticado exitosamente.", true);
    }
}
