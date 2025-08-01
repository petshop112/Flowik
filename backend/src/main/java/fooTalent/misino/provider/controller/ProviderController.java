package fooTalent.misino.provider.controller;

import fooTalent.misino.provider.dto.ProviderRegister;
import fooTalent.misino.provider.dto.ProviderResponse;
import fooTalent.misino.provider.dto.ProviderUpdated;
import fooTalent.misino.provider.dto.ProviderList;
import fooTalent.misino.provider.entity.Provider;
import fooTalent.misino.provider.service.ProviderServicelmpl;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.util.List;
@RestController
@RequestMapping("/api/products")
public class ProviderController {

    private final ProviderServicelmpl providerService;

    public ProviderController(ProviderServicelmpl providerService){
        this.providerService=providerService;
    }
    @Operation (summary = "Creacion de proveedor/provider")
    @PostMapping
    public ResponseEntity<ProviderResponse> create(@RequestBody ProviderRegister providerRegister,
                                                   UriComponentsBuilder uriComponentsBuilder){
        Provider provider = providerService.createProvider(new Provider(providerRegister));
        URI url= uriComponentsBuilder.path("/api/provider/{idprovider}")
                .buildAndExpand(provider.getId_provider())
                .toUri();
        ProviderResponse providerResponse = new ProviderResponse(provider);
        return ResponseEntity.created(url).body(providerResponse);
    }
    @Operation (summary = "Listado de proveedor/provider")
    @GetMapping
    public ResponseEntity<List<ProviderList>> getAllProviders(){
        return ResponseEntity.ok(
                providerService.getAllProvider().stream()
                        .map(pr->new ProviderList(pr))
                        .toList()
        );
    }
    @Operation (summary = "Modificar proveedor/provider")
    @PutMapping("/{idprovider}")
    public ResponseEntity<ProviderResponse> updateProvider(@PathVariable("idprovider") Long idprovider,
                                                            @RequestBody ProviderUpdated providerUpdated){
        Provider provider= providerService.getProviderById(idprovider);
        providerService.updateProvider(provider);

        ProviderResponse providerResponse = new ProviderResponse(provider);
        return ResponseEntity.ok(providerResponse);
    }
    @Operation (summary = "Modificar proveedor/provider")
    @DeleteMapping("/{idprovider}")
    public ResponseEntity DeleteProviderById(@PathVariable("idprovider") Long idprovider){
        providerService.deleteProviderById(idprovider);
        return ResponseEntity.noContent().build();
    }
}
