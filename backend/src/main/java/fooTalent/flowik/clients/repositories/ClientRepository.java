package fooTalent.flowik.clients.repositories;

import fooTalent.flowik.clients.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCreatedBy(String email);
    @Query("""
           SELECT c
           FROM Client c
           WHERE c.name_client = :name
             AND c.document_type = :docType
           """)
    Optional<Client> findByNameAndDocumentType(@Param("name") String name,
                                               @Param("docType") String docType);

    @Query(value = "SELECT * FROM client WHERE name_client = :name AND document_type = :dni", nativeQuery = true)
    Optional<Client> findByNameAndDni(@Param("name") String name, @Param("dni") String dni);
}

