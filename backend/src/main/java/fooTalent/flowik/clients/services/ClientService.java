package fooTalent.flowik.clients.services;

import fooTalent.flowik.clients.dto.ClientUpdate;
import fooTalent.flowik.clients.entities.Client;


import java.util.List;

public interface ClientService {
    Client createClient(Client client);
    List<Client> getAllClient();

    Client getClientbyId(Long id);

    boolean existClient(Long id);

    Client updateClient(Long id, ClientUpdate clientUpdate);

    void deletelogic(Long id);

    void deleteclient(Long id);
}
