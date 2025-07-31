package fooTalent.misino.users.repositories;

import fooTalent.misino.users.entity.user;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.Optional;

public interface userRepository extends JpaRepository<user, Long> {
    Optional<user> findByUserName(String username);
    Optional<user> findByEmail(String email);
    Optional<user> findByVerificationToken(String token);
}
