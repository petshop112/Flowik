package fooTalent.flowik.providers.repositories;

import fooTalent.flowik.clients.entities.Client;
import fooTalent.flowik.providers.entities.Provider;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    @Query(value = "SELECT * FROM provider WHERE cuit_provider = :cuit", nativeQuery = true)
    Optional<Provider> findByCuit(@Param("cuit") String cuit_provider);

    @Modifying
    @Transactional
    @Query("UPDATE Provider p SET p.isActive = NOT p.isActive WHERE p.id IN :ids")
    void changeState(@Param("ids") List<Long> Ids);

    @Query("SELECT p FROM Provider p WHERE p.cuit_provider = :cuit")
    Optional<Provider> findByCuit_provider(@Param("cuit") String cuit);
}

