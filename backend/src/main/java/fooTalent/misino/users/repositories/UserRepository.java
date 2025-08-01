package fooTalent.misino.users.repositories;

import fooTalent.misino.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String token);
}
