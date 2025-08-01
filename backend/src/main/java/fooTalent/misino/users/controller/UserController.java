package fooTalent.misino.users.controller;

import fooTalent.misino.users.dto.UserDto;
import fooTalent.misino.users.entity.User;
import fooTalent.misino.users.repositories.UserRepository;
import fooTalent.misino.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Operation(summary = "Obtener todos los usuarios")
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @Operation(summary = "Obtener datos del usuario por su Id, " +
            "solo se obtienen datos de cada usuario," +
            "por seguridad de datos")
    @GetMapping("/getUserByID/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        String authenticatedEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<User> optionalUser = userRepository.findByEmail(authenticatedEmail);

        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("No estás autenticado para realizar esta acción.");
        }

        User currentUser = optionalUser.get();

        if (!currentUser.getId().equals(id)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("No estás autorizado para acceder a los datos de otro usuario.");
        }

        return ResponseEntity.ok(currentUser);
    }


}
