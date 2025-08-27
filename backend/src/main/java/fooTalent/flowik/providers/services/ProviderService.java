package fooTalent.flowik.providers.services;

import fooTalent.flowik.providers.dto.ProviderUpdated;
import fooTalent.flowik.providers.entities.Provider;

import java.util.List;

public interface ProviderService {

    Provider createProvider(Provider provider);

    List<Provider> getAllProvider();

    Provider getProviderById(Long id);

    boolean existProvider(Long id);

    Provider updateProvider(Long id, ProviderUpdated providerUpdated);

    void deleteProviderById(Long id);

    List<Provider> getProvidersByIds(List<Long> providerIds);

    void deletelogic(List<Long> providerIDs);
}
