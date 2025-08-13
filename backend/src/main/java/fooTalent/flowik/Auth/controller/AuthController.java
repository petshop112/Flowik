package fooTalent.flowik.Auth.controller;

import fooTalent.flowik.Auth.dto.*;
import fooTalent.flowik.Auth.repositories.VerificationTokenRepository;
import fooTalent.flowik.Auth.service.AuthService;
import fooTalent.flowik.users.entity.User;
import fooTalent.flowik.users.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;

    @Value("${URL_FRONT}")
    private String frontUrl;

    @Operation(summary = "Registrar un nuevo usuario.")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Nombre completo recibido: '" + request.firstName() + " " + request.lastName() + "'");
        AuthResponse response = authService.register(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Iniciar sesión")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                              HttpServletResponse servletResponse) {
        AuthResponse authResponse = authService.login(request);

        if (!authResponse.success()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(authResponse);
        }

        ResponseCookie cookie = ResponseCookie.from("token", authResponse.token())
                .httpOnly(true)
                .secure(false) // en producion debe pasar a true
                .path("/")
                .maxAge(Duration.ofHours(2))
                .sameSite("Strict")
                .build();

        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Endpoint para verificaciones, USO EN BACKEND LOCAL")
    @GetMapping("/verifyToken")
    public void verifyAccount(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        if (token == null || token.isEmpty()) {
            response.sendRedirect(frontUrl + "/login?verified=invalid");
            return;
        }

        Optional<User> optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isEmpty()) {
            response.sendRedirect(frontUrl + "/login?verified=invalid");
            return;
        }

        User user = optionalUser.get();

        if (user.getVerificationTokenExpiration() == null || user.getVerificationTokenExpiration().before(new Date())) {
            response.sendRedirect(frontUrl + "/login?verified=expired");
            return;
        }

        if (user.getIsActive()) {
            response.sendRedirect(frontUrl + "/login?verified=already");
            return;
        }

        user.setIsActive(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiration(null);
        userRepository.save(user);

        response.sendRedirect(frontUrl + "/login?verified=success");
    }

    @Operation(summary = "Realizar el cambio de contraseña de un usuario")
    @PutMapping("/change_password")
    public ResponseEntity<AuthResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        AuthResponse response = authService.changePassword(request);

        if (!response.success()) {
            return switch (response.message()) {
                case "Usuario no encontrado." -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                case "Contraseña actual incorrecta." -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                default -> ResponseEntity.badRequest().body(response);
            };
        }

        return ResponseEntity.ok(response);
    }
    @Operation(summary = "Solicitar recuperacion de contraseña.")
    @PostMapping("/forgot_password")
        public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String response = authService.forgotPassword(request.email());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Restaurar contraseña de un usuario")
    @PutMapping("/reset_password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        AuthResponse response = authService.resetPassword(request);

        if (!response.success()) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }
}