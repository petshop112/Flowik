package fooTalent.flowik.client.dto;

import fooTalent.flowik.client.entity.Client;

import java.time.LocalDate;


public record ClientResponse(
        long id_client,
        String name_client,
        String document_type,
        long telephone_client,
        String direction_client,
        String emil_client,
        double dedb_client,
        LocalDate ingress_date
) {
    public ClientResponse(Client cl){
        this(
            (cl  !=null)? cl.getId_client():null,
            (cl  !=null)? cl.getName_client():null,
            (cl  !=null)? cl.getDocument_type():null,
            (cl  !=null)? cl.getTelephone_client():null,
            (cl  !=null)? cl.getDirection_client():null,
            (cl  !=null)? cl.getEmil_client():null,
            (cl  !=null)? cl.getDedb_client():null,
            (cl  !=null)? cl.getIngress_date():null
        );
    }
}