package fooTalent.flowik.client.controller;

import fooTalent.flowik.client.dto.ClientList;
import fooTalent.flowik.client.dto.ClientRegister;
import fooTalent.flowik.client.dto.ClientResponse;
import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.repositories.ClientRepository;
import fooTalent.flowik.client.service.ClientService;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
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
@RequestMapping("api/client")
public class ClientController {
    private final ClientService clientService;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    @Operation(summary = "Registrar un nuevo Cliente")
    @PostMapping("/createclient")
    public ResponseEntity<ClientResponse> create(
            @RequestBody @Valid ClientRegister clientRegister,
            UriComponentsBuilder uriBuilder
    ) {
        Client client = new Client(clientRegister);
        client.setCreatedBy(SecurityUtil.getAuthenticatedEmail());
        Client saved = clientService.createClient(client);

        URI location = uriBuilder.path("/api/client/{id_client}")
                .buildAndExpand(saved.getId_client())
                .toUri();
        return ResponseEntity.created(location).body(new ClientResponse(saved));
    }
    @Operation(summary = "Lista todos los Clientes",
    description = "Necesita ingresar el id de usuario, por cuestiones de privacidad y seguridad")
    @GetMapping("/{id_user}")
    public ResponseEntity<List<ClientList>> getAllProviders(@PathVariable("id_user") Long id_user){
        SecurityUtil.validateUserAccess(userRepository, id_user);
        return ResponseEntity.ok(
                clientService.getAllClient().stream()
                        .map(ClientList::new)
                        .toList()
        );
    }
    @Operation(summary = "Modificar un cliente por id")
    @PutMapping("/{id_client}")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable("id_client") Long id_client,
                                                       @RequestBody @Valid ClientUpdate clientUpdate){

        String email = SecurityUtil.getAuthenticatedEmail();

       Client existingClient = clientRepository.findById(id_client)
               .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado", "ID", id_client));

        if (!existingClient.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes modificar un cliente que no creaste.");
        }
        Client updated= clientService.updateClient(id_client, clientUpdate);
        return  ResponseEntity.ok(new ClientResponse(updated));
    }

    @Operation(summary = "Eliminar un cliente por id")
    @DeleteMapping("/{id_client}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id_client){

        String email = SecurityUtil.getAuthenticatedEmail();

        Client existingClient = clientRepository.findById(id_client)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado", "ID", id_client));

        if (!existingClient.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes eliminar un cliente que no creaste.");
        }

        clientService.deletelogic(id_client);
        return ResponseEntity.noContent().build();
    }

}
