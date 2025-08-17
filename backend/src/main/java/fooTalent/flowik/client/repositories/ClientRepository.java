package fooTalent.flowik.client.repositories;

import fooTalent.flowik.client.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCreatedBy(String email);
}
