package fooTalent.misino.Auth.controller;

import fooTalent.misino.Auth.dto.authResponse;
import fooTalent.misino.Auth.dto.loginRequest;
import fooTalent.misino.Auth.dto.registerRequest;
import fooTalent.misino.Auth.repositories.verificationTokenRepository;
import fooTalent.misino.Auth.service.authService;
import fooTalent.misino.users.entity.user;
import fooTalent.misino.users.repositories.userRepository;
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
@RequestMapping("/auth")
@RequiredArgsConstructor
public class authController {

    private final authService authService;
    private final verificationTokenRepository verificationTokenRepository;
    private final userRepository userRepository;

    @Value("${URL_FRONT}")
    private String frontUrl;

    @GetMapping("/saludoo")
    public String hello() {
        return "¡El backend está funcionando!";
    }

    @PostMapping("/register")
    public ResponseEntity<authResponse> register(@Valid @RequestBody registerRequest request) {
        System.out.println("Nombre completo recibido: '" + request.firstName() + " " + request.lastName() + "'");
        authResponse response = authService.register(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<authResponse> login(@Valid @RequestBody loginRequest request) {
        authResponse response = authService.login(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verifyToken")
    public void verifyAccount(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        if (token == null || token.isEmpty()) {
            response.sendRedirect(frontUrl + "/login?verified=invalid");
            return;
        }

        Optional<user> optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isEmpty()) {
            response.sendRedirect(frontUrl + "/login?verified=invalid");
            return;
        }

        user user = optionalUser.get();

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
