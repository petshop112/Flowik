package fooTalent.misino.provider.service;

import fooTalent.misino.provider.entity.Provider;
import fooTalent.misino.provider.repositories.ProviderRepositorylmpl;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProviderService implements ProviderServicelmpl {
    private final ProviderServicelmpl providerRepository;

    public ProviderService(ProviderServicelmpl providerRepository){this.providerRepository= providerRepository;}


    @Override
    public Provider createProvider(Provider provider) {
        return null;
    }

    @Override
    public List<Provider> getAllProvider() {
        return List.of();
    }

    @Override
    public Provider getProviderById(Long id) {
        return null;
    }

    @Override
    public boolean existProvider(Long id) {
        return false;
    }

    @Override
    public Provider updateProvider(Provider provider) {
        return null;
    }

    @Override
    public void deleteProviderById(Long id) {

    }
}
