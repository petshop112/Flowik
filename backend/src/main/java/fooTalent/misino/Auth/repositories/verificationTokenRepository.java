package fooTalent.misino.Auth.repositories;

import fooTalent.misino.Auth.util.verificationToken;
import fooTalent.misino.users.entity.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface verificationTokenRepository extends JpaRepository<verificationToken, Long> {
    Optional<verificationToken> findByToken(String token);
    void deleteByUser(user user);
}