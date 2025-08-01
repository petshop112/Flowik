package fooTalent.misino.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.http.HttpHeaders;

@OpenAPIDefinition(
        info = @Info(
                title = "Petshop API",
                description = "API para control de stock de petshops",
                termsOfService = "www.footalent.com",
                version = "1.0.0",
                contact = @Contact(
                        name = "Petshop",
                        email = "petshop112@hotmail.com",
                        url = ""
                )
        ),
        servers = {
                @Server(
                        description = "Local Server",
                        url = "http://localhost:8080"
                ),
                @Server(
                        description = "Server Render",
                        url = "https://petshop-db4w.onrender.com"
                )
        },
        security = @SecurityRequirement(
                name = "securityToken"
        )
    )
    @SecurityScheme(
            name = "securityToken",
            description = "Access Token For My API",
            type = SecuritySchemeType.HTTP,
            paramName = HttpHeaders.AUTHORIZATION,
            in = SecuritySchemeIn.HEADER,
            scheme = "bearer",
            bearerFormat = "JWT"
    )

public class SwaggerConfig {

}