package fooTalent.misino.users.controller;

import fooTalent.misino.Auth.service.JwtService;
import fooTalent.misino.config.SecurityUtil;
import fooTalent.misino.exceptions.ResourceNotFoundException;
import fooTalent.misino.users.dto.UserDto;
import fooTalent.misino.users.dto.UserUpdateRequest;
import fooTalent.misino.users.entity.User;
import fooTalent.misino.users.repositories.UserRepository;
import fooTalent.misino.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

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
        String email = SecurityUtil.getAuthenticatedEmail();

        Optional<User> optionalUser = userRepository.findByEmail(email);

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
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Permite eliminar un usuario, SOLO ADMIN")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        SecurityUtil.validateUserAccess(userRepository, id);
        userService.deleteById(id);
        return ResponseEntity.ok("El usuario fue eliminado correctamente");
    }
    @Operation(summary = "Actualizar datos de usuario")
    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserUpdateRequest updatedUserDTO) {
        String email = SecurityUtil.getAuthenticatedEmail();
        userService.updateUser(email, updatedUserDTO);
        return ResponseEntity.ok("Perfil actualizado correctamente.");
    }
}
