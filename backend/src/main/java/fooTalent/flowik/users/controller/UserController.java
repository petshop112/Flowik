package fooTalent.flowik.users.controller;

import fooTalent.flowik.auth.services.JwtService;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.users.dto.UserDto;
import fooTalent.flowik.users.dto.UserUpdateRequest;
import fooTalent.flowik.users.entity.User;
import fooTalent.flowik.users.repositories.UserRepository;
import fooTalent.flowik.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/{id_user}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        SecurityUtil.validateUserAccess(userRepository, id);
        User user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Eliminar un usuario")
    @DeleteMapping("/{id_user}")
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