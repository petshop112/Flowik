package fooTalent.flowik.client.repositories;

import fooTalent.flowik.client.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
