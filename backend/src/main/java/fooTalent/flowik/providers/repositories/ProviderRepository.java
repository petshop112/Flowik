package fooTalent.flowik.providers.repositories;

import fooTalent.flowik.providers.entities.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
}
