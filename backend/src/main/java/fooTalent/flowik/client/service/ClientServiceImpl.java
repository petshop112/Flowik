package fooTalent.flowik.client.service;

import fooTalent.flowik.client.dto.ClientUpdate;
import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.repositories.ClientRepository;


import fooTalent.flowik.exceptions.BadRequestException;
import fooTalent.flowik.exceptions.DuplicateResourceException;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;

    @Override
    public Client createClient(Client client){
        if (clientRepository.findByNameAndDni(client.getName_client(), client.getDocument_type()).isPresent()) {
            throw new DuplicateResourceException("Ya existe un cliente con el mismo nombre y DNI");
        }
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
    @Transactional
    public Client updateClient(Long id, ClientUpdate clientUpdate) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "ID", id));

        boolean anyUpdate = false;

        if (clientUpdate.name_client() != null && !clientUpdate.name_client().isBlank()) {
            if (clientUpdate.name_client().length() < 2 || clientUpdate.name_client().length() > 50) {
                throw new BadRequestException("El Nombre del Cliente debe tener entre 2 y 50 caracteres.");
            }
            client.setName_client(clientUpdate.name_client());
            anyUpdate = true;
        }

        if (clientUpdate.document_type() != null && !clientUpdate.document_type().isBlank()) {
            if (!clientUpdate.document_type().matches("^[0-9]{8,11}$")) {
                throw new BadRequestException("El documento debe tener entre 8 y 11 caracteres numéricos.");
            }
            client.setDocument_type(clientUpdate.document_type());
            anyUpdate = true;
        }

        if (clientUpdate.telephone_client() != null && !clientUpdate.telephone_client().isBlank()) {
            if (!clientUpdate.telephone_client().matches("^[0-9]{7,20}$")) {
                throw new BadRequestException("El teléfono debe tener entre 7 y 20 números.");
            }
            client.setTelephone_client(clientUpdate.telephone_client());
            anyUpdate = true;
        }

        if (clientUpdate.direction_client() != null && !clientUpdate.direction_client().isBlank()) {
            if (clientUpdate.direction_client().length() < 10 || clientUpdate.direction_client().length() > 100) {
                throw new BadRequestException("La dirección debe tener entre 10 y 100 caracteres.");
            }
            client.setDirection_client(clientUpdate.direction_client());
            anyUpdate = true;
        }

        if (clientUpdate.email_client() != null && !clientUpdate.email_client().isBlank()) {
            if (!clientUpdate.email_client().matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$")) {
                throw new BadRequestException("Correo electrónico inválido.");
            }
            client.setEmail_client(clientUpdate.email_client());
            anyUpdate = true;
        }

        if (!anyUpdate) {
            throw new BadRequestException("No se modificó ningún campo del cliente.");
        }

        return clientRepository.save(client);
    }
    @Override
    public void deletelogic(Long id) {
        Client cl= clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado para Desactivar"));

        cl.changeStatus();
        clientRepository.save(cl);
    }

    @Override
    public void deleteclient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado para eliminar");
        }
        clientRepository.deleteById(id);
    }


}
