package fooTalent.misino.provider.dto;

import fooTalent.misino.provider.entity.Provider;

public record ProviderList(

        Long id_provider,
        String name_provider,
        String direction_provider,
        String telephone_provider,
        String provider_description
){
    public ProviderList(Provider pr){
        this(
                pr.getId_provider(),
                pr.getName_provider(),
                pr.getDirection_provider(),
                pr.getTelephone_provider(),
                pr.getProvider_description()
        );
    }
}