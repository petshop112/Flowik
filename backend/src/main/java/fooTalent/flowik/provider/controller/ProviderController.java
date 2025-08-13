package fooTalent.flowik.provider.controller;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.provider.dto.ProviderList;
import fooTalent.flowik.provider.dto.ProviderRegister;
import fooTalent.flowik.provider.dto.ProviderResponse;
import fooTalent.flowik.provider.dto.ProviderUpdated;
import fooTalent.flowik.provider.entity.Provider;
import fooTalent.flowik.provider.service.ProviderService;
import fooTalent.flowik.users.repositories.UserRepository;
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

    public ProviderController(ProviderService providerService,
                              UserRepository userRepository) {
        this.providerService = providerService;
        this.userRepository = userRepository;
    }

    @Operation(summary = "Registrar un nuevo proveedor")
    @PostMapping("/{id_user}")
    public ResponseEntity<ProviderResponse> create(@PathVariable("id_user") Long idUser,
                                                   @RequestBody @Valid ProviderRegister providerRegister,
                                                   UriComponentsBuilder uriBuilder) {

        SecurityUtil.validateUserAccess(userRepository, idUser);

        Provider provider = providerService.createProvider(new Provider(providerRegister));

        URI location = uriBuilder.path("/api/providers/{id_provider}")
                .buildAndExpand(provider.getId_provider())
                .toUri();
        return ResponseEntity.created(location).body(new ProviderResponse(provider));
    }

    @Operation(summary = "Listar todos los proveedores")
    @GetMapping("/{id_user}")
    public ResponseEntity<List<ProviderList>> getAllProviders(@PathVariable("id_user") Long idUser) {

        SecurityUtil.validateUserAccess(userRepository, idUser);

        return ResponseEntity.ok(
                providerService.getAllProvider().stream()
                .map(ProviderList::new)
                .toList()
        );
    }

    @Operation(summary = "Modificar un proveedor por ID")
    @PutMapping("/{id_user}/{id_provider}")
    public ResponseEntity<ProviderResponse> updateProvider(@PathVariable("id_user") Long idUser,
                                                           @PathVariable Long id_provider,
                                                           @RequestBody @Valid ProviderUpdated providerUpdated) {

        SecurityUtil.validateUserAccess(userRepository, idUser);

        Provider updated = providerService.updateProvider(id_provider, providerUpdated);
        return ResponseEntity.ok(new ProviderResponse(updated));
    }

    @Operation(summary = "Eliminar un proveedor por ID")
    @DeleteMapping("/{id_provider}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id_provider) {

        providerService.deleteProviderById(id_provider);
        return ResponseEntity.noContent().build();
    }
}