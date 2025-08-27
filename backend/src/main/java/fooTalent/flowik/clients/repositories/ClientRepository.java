package fooTalent.flowik.clients.repositories;

import fooTalent.flowik.clients.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCreatedBy(String email);

    @Query(value = "SELECT * FROM client WHERE document_type = :dni", nativeQuery = true)
    Optional<Client> findByDni(@Param("dni") String document_type);

    @Query(value = "SELECT * FROM client WHERE document_type = :documentType", nativeQuery = true)
    Optional<Client> findByDocument_type(@Param("documentType") String documentType);
}

