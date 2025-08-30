package fooTalent.flowik.clients.dto;

public record ClientUpdate(
        String name_client,

        String document_type,

        String telephone_client,

        String direction_client,

        String email_client,

        String notes
) {}