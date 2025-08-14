package fooTalent.flowik.client.dto;

import fooTalent.flowik.client.entity.Client;

import java.time.LocalDate;

public record ClientList(
        long id_client,
        String name_client,
        String document_type,
        long telephone_client,
        String direction_client,
        String emil_client,
        int dedb_client,
        LocalDate ingress_date,
        boolean isactive
) {
    public ClientList(Client cl){this(
            cl.getId_client(),
            cl.getName_client(),
            cl.getDocument_type(),
            cl.getTelephone_client(),
            cl.getDirection_client(),
            cl.getEmil_client(),
            cl.getDedb_client(),
            cl.getIngress_date(),
            cl.isIsactive()
            );
    }
}
