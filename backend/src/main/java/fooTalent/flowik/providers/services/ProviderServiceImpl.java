package fooTalent.flowik.providers.services;

import fooTalent.flowik.exceptions.BadRequestException;
import fooTalent.flowik.exceptions.DuplicateResourceException;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.providers.dto.ProviderUpdated;
import fooTalent.flowik.providers.entities.Provider;
import fooTalent.flowik.providers.repositories.ProviderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;

    @Override
    public Provider createProvider(Provider provider) {
        if (providerRepository.findByCuit(provider.getCuit_provider()).isPresent()) {
            throw new DuplicateResourceException("Ya existe un proveedor con el mismo CUIT");
        }
        return providerRepository.save(provider); // isActive y createdBy se setean en @PrePersist
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
    public Provider updateProvider(Long id, ProviderUpdated dto) {
        Provider existing = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "ID", id));

        boolean anyUpdate = false;

        if (dto.name_provider() != null && !dto.name_provider().isBlank()) {
            if (dto.name_provider().length() < 2 || dto.name_provider().length() > 50) {
                throw new BadRequestException("El Nombre del Proveedor debe tener entre 2 y 50 caracteres.");
            }
            anyUpdate = true;
            existing.setName_provider(dto.name_provider());
        }

        if (dto.cuit_provider() != null && !dto.cuit_provider().isBlank()) {
            if (!dto.cuit_provider().matches("^[0-9]{11}$")) {
                throw new BadRequestException("El CUIT debe contener exactamente 11 dígitos numéricos.");
            }
            Optional<Provider> providerWithSameCuit = providerRepository.findByCuit_provider(dto.cuit_provider());
            if (providerWithSameCuit
                    .filter(p -> !Objects.equals(p.getId_provider(), id))
                    .isPresent()) {
                throw new BadRequestException("Ya existe un proveedor registrado con ese CUIT.");
            }

            anyUpdate = true;
            existing.setCuit_provider(dto.cuit_provider());
        }

        if (dto.direction_provider() != null && !dto.direction_provider().isBlank()) {
            if (dto.direction_provider().length() < 10 || dto.direction_provider().length() > 100) {
                throw new BadRequestException("La Dirección del Proveedor debe tener entre 10 y 100 caracteres.");
            }
            anyUpdate = true;
            existing.setDirection_provider(dto.direction_provider());
        }

        if (dto.telephone_provider() != null && !dto.telephone_provider().isBlank()) {
            if (!dto.telephone_provider().matches("^[0-9]{7,20}$")) {
                throw new BadRequestException("El número telefónico debe contener solo números (entre 7 y 20 dígitos).");
            }
            anyUpdate = true;
            existing.setTelephone_provider(dto.telephone_provider());
        }

        if (dto.email_provider() != null && !dto.email_provider().isBlank()) {
            if (!dto.email_provider().matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$")) {
                throw new BadRequestException("Correo de proveedor inválido.");
            }
            anyUpdate = true;
            existing.setEmail_provider(dto.email_provider());
        }

        if (dto.category_provider() != null && !dto.category_provider().isBlank()) {
            if (dto.category_provider().length() > 300) {
                throw new BadRequestException("La categoría del Proveedor debe tener hasta 300 caracteres.");
            }
            anyUpdate = true;
            existing.setCategory_provider(dto.category_provider());
        }

        if (!anyUpdate) {
            throw new BadRequestException("No se modificó ningún campo del proveedor.");
        }

        return providerRepository.save(existing);
    }


    @Override
    public void deleteProviderById(Long id) {
        providerRepository.deleteById(id);
    }

    @Override
    public List<Provider> getProvidersByIds(List<Long> providerIds) {
        return providerRepository.findAllById(providerIds);
    }

    @Override
    @Transactional
    public void deletelogic(List<Long> providerIDs) {
        providerRepository.changeState(providerIDs);
    }
}
