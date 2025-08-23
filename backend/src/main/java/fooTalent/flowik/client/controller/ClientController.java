package fooTalent.flowik.client.controller;

import fooTalent.flowik.client.dto.ClientRegister;
import fooTalent.flowik.client.dto.ClientResponse;
import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.repositories.ClientRepository;
import fooTalent.flowik.client.service.ClientService;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.users.entity.User;
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
        Client saved = clientService.createClient(client);

        URI location = uriBuilder.path("/api/client/{id_client}")
                .buildAndExpand(saved.getId_client())
                .toUri();
        return ResponseEntity.created(location).body(new ClientResponse(saved));
    }
    @Operation(summary = "Obtener un cliente por su ID")
    @GetMapping("/{id_client}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable("id_client") Long id_client) {

        String email = SecurityUtil.getAuthenticatedEmail();
        Client existingClient = clientRepository.findById(id_client)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "ID", id_client));

        if (!existingClient.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes ver un cliente que no creaste.");
        }

        return ResponseEntity.ok(new ClientResponse(existingClient));
    }

    @Operation(summary = "Lista todos los Clientes",
    description = "Necesita ingresar el id de usuario, por cuestiones de privacidad y seguridad")
    @GetMapping("/{id_user}")
    public ResponseEntity<List<ClientResponse>> getAllClients(@PathVariable("id_user") Long id_user){
        SecurityUtil.validateUserAccess(userRepository, id_user);

        User user = userRepository.findById(id_user)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id_user));
        String email = user.getEmail();

        List<ClientResponse> clients = clientService.getAllClient().stream()
                .filter(client -> client.getCreatedBy().equals(email))
                .map(ClientResponse::new)
                .toList();
        if (clients.isEmpty()) {
            throw new ResourceNotFoundException("Clientes", "Usuario", id_user);
        }
        return ResponseEntity.ok(clients);
    }
    @Operation(summary = "Modificar un cliente por id")
    @PutMapping("/{id_client}")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable("id_client") Long id_client,
                                                       @RequestBody @Valid ClientUpdate clientUpdate) {

        String email = SecurityUtil.getAuthenticatedEmail();

        if (isAllFieldsEmpty(clientUpdate)) {
            throw new IllegalArgumentException("Debe enviar al menos un campo para actualizar");
        }

        Client existingClient = clientRepository.findById(id_client)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado", "ID", id_client));

        if (!existingClient.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes modificar un cliente que no creaste.");
        }

        Client updated = clientService.updateClient(id_client, clientUpdate);
        return ResponseEntity.ok(new ClientResponse(updated));
    }

    private boolean isAllFieldsEmpty(ClientUpdate clientUpdate) {
        return (isBlank(clientUpdate.name_client()) &&
                isBlank(clientUpdate.document_type()) &&
                isBlank(clientUpdate.telephone_client()) &&
                isBlank(clientUpdate.direction_client()) &&
                isBlank(clientUpdate.email_client()));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
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
