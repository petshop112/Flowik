package fooTalent.flowik.client.service;

import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.repositories.ClientRepository;


import fooTalent.flowik.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;

    @Override
    public Client createClient(Client client){
        return clientRepository.save(client);
        }

    public List<Client> getAllClientByUser(String email) {
        return clientRepository.findByCreatedBy(email);
    }
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
            throw new BadRequestException("Cliente no encontrado para actualizar");
        }
        return clientRepository.save(client);
    }
    @Override
    public Client updateClient(Long id, ClientUpdate clientUpdate) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));

        existing.updateFromDto(clientUpdate);
        return clientRepository.save(existing);
    }
    @Override
    public void deletelogic(Long id) {
        Client cl= clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado para eliminar"));

        cl.setIsActive(false);
        clientRepository.save(cl);
    }

}
