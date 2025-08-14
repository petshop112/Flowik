package fooTalent.misino.client.service;

import fooTalent.misino.client.dto.ClientUpdate;
import fooTalent.misino.client.entity.Client;


import java.util.List;

public interface ClientService {
    Client createClient(Client client);
    List<Client> getAllClient();

    Client getClientbyId(Long id);

    boolean existClient(Long id);

    Client updateClient(Client client);

    Client updateClient(Long id, ClientUpdate clientUpdate);

    void deletelogic(Long id);
}
