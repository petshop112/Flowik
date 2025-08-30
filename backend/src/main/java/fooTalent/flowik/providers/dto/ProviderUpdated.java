package fooTalent.flowik.providers.dto;

import fooTalent.flowik.validations.ValidAddress;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProviderUpdated(
        String name_provider,
        String cuit_provider,
        String direction_provider,
        String telephone_provider,
        String email_provider,
        String category_provider
){
}