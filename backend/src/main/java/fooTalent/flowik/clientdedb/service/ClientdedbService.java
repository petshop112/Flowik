package fooTalent.flowik.clientdedb.service;



import fooTalent.flowik.clientdedb.entity.ClientDedb;

import java.util.List;

public interface ClientdedbService {
    ClientDedb createClientdeb(ClientDedb clientdedb);
    List<ClientDedb> getAllClient();
    ClientDedb getClientid(Long id);
    boolean existCliendedb(Long id);

}
