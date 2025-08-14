package fooTalent.flowik.client.controller;

import fooTalent.flowik.client.dto.ClientList;
import fooTalent.flowik.client.dto.ClientRegister;
import fooTalent.flowik.client.dto.ClientResponse;
import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.service.ClientService;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.users.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/client")
public class ClientController {
    private final ClientService clientService;
    private final UserRepository userRepository;

    public  ClientController (ClientService clientService,
                            UserRepository userRepository){
       this.clientService = clientService;
       this.userRepository = userRepository;
    }
    @Operation(summary = "Registrar un nuevo Cliente")
    @PostMapping("/createclient")
    public ResponseEntity<ClientResponse> crete(
                                                @RequestBody @Valid ClientRegister clientRegister,
                                                UriComponentsBuilder uriBuilder){
        Client client = clientService.createClient(new Client(clientRegister));
        URI location = uriBuilder.path("/api/client/{id_client}")
                .buildAndExpand(client.getId_client())
                .toUri();
        return ResponseEntity.created(location).body(new ClientResponse(client));
    }
    @Operation(summary = "Lista todos los Clientes")
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
    @PutMapping("/{id_user}")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable("id_user") Long id_user,
                                                       @PathVariable Long id_client,
                                                       @RequestBody @Valid ClientUpdate clientUpdate){
        SecurityUtil.validateUserAccess(userRepository, id_user);
        Client updated= clientService.updateClient(id_client, clientUpdate);
        return  ResponseEntity.ok(new ClientResponse(updated));
    }

    @Operation(summary = "Eliminar un cliente por id")
    @DeleteMapping("/{id_client}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long idclient){
        clientService.deletelogic(idclient);
        return ResponseEntity.noContent().build();
    }

}
