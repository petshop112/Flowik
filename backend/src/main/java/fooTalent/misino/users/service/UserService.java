package fooTalent.misino.users.service;

import fooTalent.misino.Auth.dto.AuthResponse;
import fooTalent.misino.Auth.util.UserValidation;
import fooTalent.misino.exceptions.ForbiddenException;
import fooTalent.misino.exceptions.ResourceNotFoundException;
import fooTalent.misino.exceptions.UnauthorizedException;
import fooTalent.misino.users.dto.UserDto;
import fooTalent.misino.users.dto.UserUpdateRequest;
import fooTalent.misino.users.entity.User;
import fooTalent.misino.users.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final UserValidation userValidation;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public UserDto convertToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    public void deleteById(Long id) {
       userRepository.deleteById(id);
    }

    public void updateUser(String email, UserUpdateRequest updatedUserDTO) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        boolean isModified = false;

        String newFirstName = updatedUserDTO.getFirstName();
        if (newFirstName != null && !newFirstName.equals(existingUser.getFirstName())) {
            AuthResponse validation = userValidation.validateName(newFirstName, "Nombre");
            if (!validation.success()) {
                throw new IllegalArgumentException(validation.message());
            }
            existingUser.setFirstName(newFirstName);
            isModified = true;
        }

        String newLastName = updatedUserDTO.getLastName();
        if (newLastName != null && !newLastName.equals(existingUser.getLastName())) {
            AuthResponse validation = userValidation.validateName(newLastName, "Apellido");
            if (!validation.success()) {
                throw new IllegalArgumentException(validation.message());
            }
            existingUser.setLastName(newLastName);
            isModified = true;
        }

        if (!isModified) {
            throw new IllegalArgumentException("No se detectaron cambios para actualizar.");
        }

        userRepository.save(existingUser);
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }
}
