package fooTalent.misino.provider.repositories;
import fooTalent.misino.provider.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderRepositorylmpl extends JpaRepository<Provider, Long> {

}