package fooTalent.misino.provider.service;
import fooTalent.misino.provider.entity.Provider;
import java.util.List;

public interface ProviderServicelmpl {
    Provider createProvider(Provider provider);
    List<Provider> getAllProvider();
    Provider getProviderById(Long id);
    boolean existProvider(Long id);
    Provider updateProvider(Provider provider);
    void deleteProviderById(Long id);
}
