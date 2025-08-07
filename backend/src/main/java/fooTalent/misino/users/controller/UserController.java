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
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Operation(summary = "Listar todos los usuarios")
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Obtener datos del usuario por su ID " +
                         "(solo se obtienen datos de cada usuario por seguridad de datos)")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        SecurityUtil.validateUserAccess(userRepository, id);
        User user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar un usuario, SOLO ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        SecurityUtil.validateUserAccess(userRepository, id);
        userService.deleteById(id);
        return ResponseEntity.ok("El usuario fue eliminado correctamente");
    }

    @Operation(summary = "Modificar datos del usuario")
    @PutMapping
    public ResponseEntity<?> updateUserProfile(@RequestBody UserUpdateRequest updatedUserDTO) {
        String email = SecurityUtil.getAuthenticatedEmail();
        userService.updateUser(email, updatedUserDTO);
        return ResponseEntity.ok("Perfil actualizado correctamente.");
    }
}