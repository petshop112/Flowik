package fooTalent.flowik.provider.repositories;

import fooTalent.flowik.provider.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
}
