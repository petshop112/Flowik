package fooTalent.misino.Auth.controller;

import fooTalent.misino.Auth.dto.AuthResponse;
import fooTalent.misino.Auth.dto.LoginRequest;
import fooTalent.misino.Auth.dto.RegisterRequest;
import fooTalent.misino.Auth.repositories.VerificationTokenRepository;
import fooTalent.misino.Auth.service.AuthService;
import fooTalent.misino.users.entity.User;
import fooTalent.misino.users.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @Operation(summary = "Registrar un nuevo usuario." +
            " El campo Rol recibe USER o ADMIN")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Nombre completo recibido: '" + request.firstName() + " " + request.lastName() + "'");
        AuthResponse response = authService.register(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Iniciar sesion")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
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
}