package fooTalent.flowik.providers.dto;

import fooTalent.flowik.providers.entities.Provider;

public record ProviderResponse(

        Long id_provider,
        String name_provider,
        String cuit_provider,
        String direction_provider,
        String telephone_provider,
        String email_provider,
        String category_provider
){
    public ProviderResponse(Provider pr){
        this(
                (pr !=null)? pr.getId_provider():null,
                (pr !=null)? pr.getName_provider():null,
                (pr !=null)? pr.getCuit_provider():null,
                (pr !=null)? pr.getDirection_provider():null,
                (pr !=null)? pr.getTelephone_provider():null,
                (pr !=null)? pr.getEmail_provider():null,
                (pr !=null)? pr.getCategory_provider():null
        );
    }
}