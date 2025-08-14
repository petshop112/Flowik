package fooTalent.misino.clientdedb.service;

import fooTalent.misino.clientdedb.dto.DedbUpdate;
import fooTalent.misino.clientdedb.entity.ClientDedb;
import fooTalent.misino.clientdedb.repositories.ClientDedbRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientdedbServicelmpl implements ClientdedbService{
    private final ClientDedbRepository clientdedbRepository;
    @Override
    public ClientDedb createClientdeb(ClientDedb clientdedb){return clientdedbRepository.save(clientdedb);}
    @Override
    public List<ClientDedb> getAllClient(){return clientdedbRepository.findAll();}
    @Override
    public ClientDedb getClientid(Long id){
        return clientdedbRepository.findById(id).
                orElseThrow(()-> new RuntimeException("La deuda no fue encontrada: "+id));
    }
    @Override
    public boolean existCliendedb(Long id){
        return clientdedbRepository.existsById(id);
    }

    public ClientDedb updatedClient(Long id, DedbUpdate DedbUpdate){
        ClientDedb existing = clientdedbRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Deuda no encontrada ID: "+id));
        existing.setDedb_client(DedbUpdate.dedb_client());
        existing.setMount(DedbUpdate.mount());
        return  clientdedbRepository.save(existing);
    }
}
