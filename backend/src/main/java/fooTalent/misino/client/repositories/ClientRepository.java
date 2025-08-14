package fooTalent.misino.client.repositories;

import fooTalent.misino.client.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
