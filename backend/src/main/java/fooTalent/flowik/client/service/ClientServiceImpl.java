package fooTalent.flowik.client.service;

import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.repositories.ClientRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;
    @Override
    public Client createClient(Client client){return clientRepository.save(client);}
    @Override
    public List<Client> getAllClient(){return clientRepository.findAll();}
    @Override
    public Client getClientbyId (Long id){
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));
    }
    @Override
    public boolean existClient(Long id){
        return clientRepository.existsById(id);
    }
    @Override
    public Client updateClient(Client client) {
        if (!clientRepository.existsById(client.getId_client())) {
            throw new RuntimeException("Cliente no encontrado para actualizar");
        }
        return clientRepository.save(client);
    }
    @Override
    public Client updateClient(Long id, ClientUpdate clientUpdate) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));

        existing.setName_client(clientUpdate.name_client());
        existing.setDirection_client(clientUpdate.direction_client());
        existing.setDocument_type(clientUpdate.document_type());
        existing.setTelephone_client(clientUpdate.telephone_client());
        existing.setEmil_client(clientUpdate.emil_client());
        existing.setIngress_date(clientUpdate.ingress_date());
        return clientRepository.save(existing);
    }
    @Override
    public void deletelogic(Long id) {
        Client cl= new Client();
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado para eliminar");
        }

        cl.setIsactive(false);
        clientRepository.save(cl);
    }

}
