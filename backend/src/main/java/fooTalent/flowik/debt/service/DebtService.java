package fooTalent.flowik.debt.service;



import fooTalent.flowik.debt.entity.Debt;

import java.util.List;

public interface DebtService {
    Debt createClientdeb(Debt clientdedb);
    List<Debt> getAllClient();
    Debt getClientid(Long id);
    boolean existCliendedb(Long id);

}
