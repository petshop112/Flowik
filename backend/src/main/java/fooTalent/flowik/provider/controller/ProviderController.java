package fooTalent.flowik.provider.controller;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.provider.dto.ProviderList;
import fooTalent.flowik.provider.dto.ProviderRegister;
import fooTalent.flowik.provider.dto.ProviderResponse;
import fooTalent.flowik.provider.dto.ProviderUpdated;
import fooTalent.flowik.provider.entity.Provider;
import fooTalent.flowik.provider.repositories.ProviderRepository;
import fooTalent.flowik.provider.service.ProviderService;
import fooTalent.flowik.users.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;

    @Operation(summary = "Registrar un nuevo proveedor")
    @PostMapping("")
    public ResponseEntity<ProviderResponse> create(@RequestBody @Valid ProviderRegister providerRegister,
                                                   UriComponentsBuilder uriBuilder) {

        Provider provider = providerService.createProvider(new Provider(providerRegister));

        URI location = uriBuilder.path("/api/providers/{id_provider}")
                .buildAndExpand(provider.getId_provider())
                .toUri();
        return ResponseEntity.created(location).body(new ProviderResponse(provider));
    }

    @Operation(summary = "Listar todos los proveedores del usuario autenticado")
    @GetMapping("")
    public ResponseEntity<List<ProviderList>> getAllProviders() {

        String email = SecurityUtil.getAuthenticatedEmail();

        List<ProviderList> providerList = providerService.getAllProvider().stream()
                .filter(provider -> provider.getCreatedBy().equals(email))
                .map(ProviderList::new)
                .toList();

        if (providerList.isEmpty()) {
            throw new ResourceNotFoundException("Proveedores", "Usuario", email);
        }

        return ResponseEntity.ok(providerList);
    }

    @Operation(summary = "Traer un proveedor por ID")
    @GetMapping("/{id_provider}")
    public ResponseEntity<ProviderResponse> getProviderById(@PathVariable("id_provider") Long id_provider){

        String email = SecurityUtil.getAuthenticatedEmail();
        Provider existingProvider = providerRepository.findById(id_provider)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "ID", id_provider));

        if (!existingProvider.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes modificar un proveedor que no creaste.");
        }
        return ResponseEntity.ok(new ProviderResponse(existingProvider));
    }

    @Operation(summary = "Modificar un proveedor por ID")
    @PutMapping("/{id_provider}")
    public ResponseEntity<ProviderResponse> updateProvider(@PathVariable Long id_provider,
                                                           @RequestBody @Valid ProviderUpdated providerUpdated) {

        String email = SecurityUtil.getAuthenticatedEmail();

        Provider existingProvider = providerRepository.findById(id_provider)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "ID", id_provider));

        if (!existingProvider.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes modificar un proveedor que no creaste.");
        }

        Provider updated = providerService.updateProvider(id_provider, providerUpdated);
        return ResponseEntity.ok(new ProviderResponse(updated));
    }
}