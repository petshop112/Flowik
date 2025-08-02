package fooTalent.misino.provider.controller;

import fooTalent.misino.provider.dto.ProviderList;
import fooTalent.misino.provider.dto.ProviderRegister;
import fooTalent.misino.provider.dto.ProviderResponse;
import fooTalent.misino.provider.dto.ProviderUpdated;
import fooTalent.misino.provider.entity.Provider;
import fooTalent.misino.provider.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @Operation(summary = "Crear proveedor")
    @PostMapping
    public ResponseEntity<ProviderResponse> create(@RequestBody ProviderRegister providerRegister,
                                                   UriComponentsBuilder uriBuilder) {
        Provider provider = providerService.createProvider(new Provider(providerRegister));
        URI location = uriBuilder.path("/api/providers/{id}")
                .buildAndExpand(provider.getId_provider())
                .toUri();
        return ResponseEntity.created(location).body(new ProviderResponse(provider));
    }

    @Operation(summary = "Listar todos los proveedores")
    @GetMapping
    public ResponseEntity<List<ProviderList>> getAllProviders() {
        List<ProviderList> providers = providerService.getAllProvider().stream()
                .map(ProviderList::new)
                .toList();
        return ResponseEntity.ok(providers);
    }

    @Operation(summary = "Actualizar proveedor por ID")
    @PutMapping("/{id}")
    public ResponseEntity<ProviderResponse> updateProvider(@PathVariable Long id,
                                                           @RequestBody ProviderUpdated providerUpdated) {
        Provider updated = providerService.updateProvider(id, providerUpdated);
        return ResponseEntity.ok(new ProviderResponse(updated));
    }


    @Operation(summary = "Eliminar proveedor por ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        providerService.deleteProviderById(id);
        return ResponseEntity.noContent().build();
    }
}
