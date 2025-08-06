package fooTalent.misino.Auth.service;

import fooTalent.misino.Auth.dto.AuthResponse;
import fooTalent.misino.Auth.dto.LoginRequest;
import fooTalent.misino.Auth.dto.RegisterRequest;
import fooTalent.misino.Auth.repositories.VerificationTokenRepository;
import fooTalent.misino.Auth.util.UserValidation;
import fooTalent.misino.users.entity.User;
import fooTalent.misino.users.repositories.UserRepository;
import fooTalent.misino.Auth.util.EmailService;
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
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserValidation userValidation;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;

    @Value("${URL_FRONT}")
    private String frontUrl;
    @Value("${URL_BACK}")
    private String backUrl;

    public AuthResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            return new AuthResponse(null, "Las contraseñas no coinciden.", false);
        }

        String fullName = request.firstName() + " " + request.lastName();

        User tempUser = new User();
        tempUser.setUserName(fullName);
        tempUser.setEmail(request.email());
        tempUser.setPassword(request.password());

        AuthResponse validationResponse = userValidation.validate(tempUser);
        if (!validationResponse.success()) {
            return validationResponse;
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            return new AuthResponse(null, "El email ya está registrado", false);
        }

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUserName(fullName);
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiration(new Date(System.currentTimeMillis() + 86400000)); // Expira en 1 día
        user.setIsActive(false);
        user.setRole(request.role());

        try {
            String link = backUrl + "/auth/verifyToken?token=" + verificationToken;
            emailService.sendEmail(user.getEmail(), "Verifica tu cuenta",
                    "<p>Hola " + user.getUserName() + ",</p>" +
                            "<p>Gracias por registrarte en nuestra web app para controlar tu " +
                            "Petshop. Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>" +
                            "<a href=\"" + link + "\">Verificar cuenta</a>"
            );
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo enviar el email de verificación. El usuario no fue registrado.", e);
        }

        System.out.println("Token de verificación enviado: " + verificationToken);
        return new AuthResponse(null, "Usuario registrado exitosamente. Por favor verifica tu correo, " +
                "no olvides revisar tu casilla de spam", true);
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.email());
        if (optionalUser.isEmpty()) {
            return new AuthResponse(null, "Usuario no encontrado.", false);
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
        } catch (Exception e) {
            return new AuthResponse(null, "Contraseña incorrecta.", false);
        }

        User user = optionalUser.get();
        String jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, "Usuario autenticado exitosamente.", true);
    }
}
