package fooTalent.flowik.client.service;

import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.client.entity.Client;


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
