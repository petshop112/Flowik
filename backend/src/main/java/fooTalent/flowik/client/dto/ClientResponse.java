package fooTalent.flowik.client.dto;

import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.debt.dto.DebtResponse;

import java.time.LocalDate;
import java.util.List;


public record ClientResponse(
        Long id_client,
        String name_client,
        String document_type,
        String telephone_client,
        String direction_client,
        String email_client,
        LocalDate ingress_date,
        List<DebtResponse> debts,
        boolean isActive
) {
    public ClientResponse(Client client) {
        this(
                client.getId_client(),
                client.getName_client(),
                client.getDocument_type(),
                client.getTelephone_client(),
                client.getDirection_client(),
                client.getEmail_client(),
                client.getIngress_date(),
                client.getDebts().stream()
                        .map(DebtResponse::new)
                        .toList(),
                client.getIsActive()
        );
    }
    }
