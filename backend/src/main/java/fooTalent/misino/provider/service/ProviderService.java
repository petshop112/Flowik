package fooTalent.misino.provider.service;

import fooTalent.misino.provider.dto.ProviderUpdated;
import fooTalent.misino.provider.entity.Provider;

import java.util.List;

public interface ProviderService {

    Provider createProvider(Provider provider);

    List<Provider> getAllProvider();

    Provider getProviderById(Long id);

    boolean existProvider(Long id);

    Provider updateProvider(Provider provider);

    Provider updateProvider(Long id, ProviderUpdated providerUpdated);

    void deleteProviderById(Long id);
}
