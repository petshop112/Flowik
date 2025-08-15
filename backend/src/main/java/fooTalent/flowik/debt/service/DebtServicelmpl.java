/*package fooTalent.flowik.debt.service;

import fooTalent.flowik.debt.dto.DebtUpdate;
import fooTalent.flowik.debt.entity.Debt;
import fooTalent.flowik.debt.repositories.DedbRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DebtServicelmpl implements DebtService {
    private final DedbRepository clientdedbRepository;
    @Override
    public Debt createClientdeb(Debt clientdedb){return clientdedbRepository.save(clientdedb);}
    @Override
    public List<Debt> getAllClient(){return clientdedbRepository.findAll();}
    @Override
    public Debt getClientid(Long id){
        return clientdedbRepository.findById(id).
                orElseThrow(()-> new RuntimeException("La deuda no fue encontrada: "+id));
    }
    @Override
    public boolean existCliendedb(Long id){
        return clientdedbRepository.existsById(id);
    }

    public Debt updatedClient(Long id, DebtUpdate DedbUpdate){
        Debt existing = clientdedbRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Deuda no encontrada ID: "+id));
        existing.setDedb_client(DedbUpdate.dedb_client());
        existing.setMount(DedbUpdate.mount());
        return  clientdedbRepository.save(existing);
    }
}
*/