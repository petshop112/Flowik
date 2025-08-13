package fooTalent.flowik.provider.dto;

import fooTalent.flowik.provider.entity.Provider;

public record ProviderResponse(

        Long id_provider,
        String name_provider,
        String direction_provider,
        String telephone_provider,
        String provider_description
){
    public ProviderResponse(Provider pr){
        this(
                (pr !=null)? pr.getId_provider():null,
                (pr !=null)? pr.getName_provider():null,
                (pr !=null)? pr.getDirection_provider():null,
                (pr !=null)? pr.getTelephone_provider():null,
                (pr !=null)? pr.getProvider_description():null
        );
    }
}