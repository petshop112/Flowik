package fooTalent.flowik.clients.dto;

import fooTalent.flowik.clients.entities.Client;
import fooTalent.flowik.debts.dto.DebtResponse;


import java.time.LocalDate;
import java.util.List;

public record ClientList(
        Long id_client,
        String name_client,
        String document_type,
        String telephone_client,
        String direction_client,
        String email_client,
        LocalDate ingress_date,
        String notes,
        boolean isActive,
        List<DebtResponse> debts
) {

    public ClientList(Client cl){this(
            cl.getId_client(),
            cl.getName_client(),
            cl.getDocument_type(),
            cl.getTelephone_client(),
            cl.getDirection_client(),
            cl.getEmail_client(),
            cl.getIngress_date(),
            cl.getNotes(),
            cl.getIsActive(),
            cl.getDebts().stream()
                    .map(DebtResponse::new)
                    .toList()
            );
    }
}
