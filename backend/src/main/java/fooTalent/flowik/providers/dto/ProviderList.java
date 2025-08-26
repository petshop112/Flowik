package fooTalent.flowik.providers.dto;

import fooTalent.flowik.providers.entities.Provider;

public record ProviderList(

        Long id_provider,
        String name_provider,
        String cuit_provider,
        String direction_provider,
        String telephone_provider,
        String email_provider,
        String category_provider
){
    public ProviderList(Provider pr){
        this(
                pr.getId_provider(),
                pr.getName_provider(),
                pr.getCuit_provider(),
                pr.getDirection_provider(),
                pr.getTelephone_provider(),
                pr.getEmail_provider(),
                pr.getCategory_provider()
        );
    }
}