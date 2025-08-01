package fooTalent.misino.users.service;

import fooTalent.misino.Auth.util.UserValidation;
import fooTalent.misino.users.dto.UserDto;
import fooTalent.misino.users.entity.User;
import fooTalent.misino.users.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
}
