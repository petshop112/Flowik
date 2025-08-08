package fooTalent.misino.provider.controller;

import fooTalent.misino.config.SecurityUtil;
import fooTalent.misino.provider.dto.ProviderList;
import fooTalent.misino.provider.dto.ProviderRegister;
import fooTalent.misino.provider.dto.ProviderResponse;
import fooTalent.misino.provider.dto.ProviderUpdated;
import fooTalent.misino.provider.entity.Provider;
import fooTalent.misino.provider.service.ProviderService;
import fooTalent.misino.users.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;
    private final UserRepository userRepository;

    public ProviderController(ProviderService providerService, UserRepository userRepository) {
        this.providerService = providerService;
        this.userRepository = userRepository;
    }

    @Operation(summary = "Crear proveedor")
    @PostMapping("/{userId}")
    public ResponseEntity<ProviderResponse> create(@PathVariable Long userId,
                                                   @RequestBody @Valid ProviderRegister providerRegister,
                                                   UriComponentsBuilder uriBuilder) {
        SecurityUtil.validateUserAccess(userRepository, userId);

        Provider provider = providerService.createProvider(new Provider(providerRegister));
        URI location = uriBuilder.path("/api/providers/{id}")
                .buildAndExpand(provider.getId_provider())
                .toUri();
        return ResponseEntity.created(location).body(new ProviderResponse(provider));
    }

    @Operation(summary = "Listar todos los proveedores de un usuario")
    @GetMapping("/{userId}")
    public ResponseEntity<List<ProviderList>> getAllProviders(@PathVariable Long userId) {
        SecurityUtil.validateUserAccess(userRepository, userId);

        List<ProviderList> providers = providerService.getAllProvider().stream()
                .map(ProviderList::new)
                .toList();
        return ResponseEntity.ok(providers);
    }

    @Operation(summary = "Actualizar proveedor por ID")
    @PutMapping("/{userId}/{id_provider}")
    public ResponseEntity<ProviderResponse> updateProvider(@PathVariable Long userId,
                                                           @PathVariable Long id_provider,
                                                           @RequestBody @Valid ProviderUpdated providerUpdated) {
        SecurityUtil.validateUserAccess(userRepository, userId);

        Provider updated = providerService.updateProvider(id_provider, providerUpdated);
        return ResponseEntity.ok(new ProviderResponse(updated));
    }

    @Operation(summary = "Eliminar proveedor por ID, SOLO ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id_provider}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id_provider) {
        providerService.deleteProviderById(id_provider);
        return ResponseEntity.noContent().build();
    }
}