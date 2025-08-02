package fooTalent.misino.provider.repositories;

import fooTalent.misino.provider.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
}
