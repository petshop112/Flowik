package fooTalent.flowik.provider.service;

import fooTalent.flowik.provider.dto.ProviderUpdated;
import fooTalent.flowik.provider.entity.Provider;

import java.util.List;

public interface ProviderService {

    Provider createProvider(Provider provider);

    List<Provider> getAllProvider();

    Provider getProviderById(Long id);

    boolean existProvider(Long id);

    Provider updateProvider(Provider provider);

    Provider updateProvider(Long id, ProviderUpdated providerUpdated);

    void deleteProviderById(Long id);

    List<Provider> getProvidersByIds(List<Long> providerIds);
}
