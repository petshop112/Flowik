package fooTalent.flowik.providers.services;

import fooTalent.flowik.providers.dto.ProviderUpdated;
import fooTalent.flowik.providers.entities.Provider;
import fooTalent.flowik.providers.repositories.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;

    @Override
    public Provider createProvider(Provider provider) {

        return providerRepository.save(provider);
    }

    @Override
    public List<Provider> getAllProvider() {
        return providerRepository.findAll();
    }

    @Override
    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));
    }

    @Override
    public boolean existProvider(Long id) {
        return providerRepository.existsById(id);
    }

    @Override
    public Provider updateProvider(Provider provider) {
        if (!providerRepository.existsById(provider.getId_provider())) {
            throw new RuntimeException("Proveedor no encontrado para actualizar");
        }
        return providerRepository.save(provider);
    }

    @Override
    public Provider updateProvider(Long id, ProviderUpdated providerUpdated) {
        Provider existing = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));

        existing.setName_provider(providerUpdated.name_provider());
        existing.setCuit_provider(providerUpdated.cuit_provider());
        existing.setDirection_provider(providerUpdated.direction_provider());
        existing.setTelephone_provider(providerUpdated.telephone_provider());
        existing.setEmail_provider(providerUpdated.email_provider());
        existing.setCategory_provider(providerUpdated.category_provider());

        return providerRepository.save(existing);
    }

    @Override
    public void deleteProviderById(Long id) {
        if (!providerRepository.existsById(id)) {
            throw new RuntimeException("Proveedor no encontrado para eliminar");
        }
        providerRepository.deleteById(id);
    }

    public List<Provider> getProvidersByIds(List<Long> providerIds) {
        return providerRepository.findAllById(providerIds);
    }
}
