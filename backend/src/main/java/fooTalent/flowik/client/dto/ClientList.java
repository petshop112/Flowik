package fooTalent.flowik.client.dto;

import fooTalent.flowik.client.entity.Client;


import java.time.LocalDate;

public record ClientList(
        long id_client,
        String name_client,
        String document_type,
        String telephone_client,
        String direction_client,
        String email_client,
        LocalDate ingress_date,
        boolean isActive
) {
    public ClientList(Client cl){this(
            cl.getId_client(),
            cl.getName_client(),
            cl.getDocument_type(),
            cl.getTelephone_client(),
            cl.getDirection_client(),
            cl.getEmail_client(),
            cl.getIngress_date(),
            cl.getIsActive()
            );
    }
}
