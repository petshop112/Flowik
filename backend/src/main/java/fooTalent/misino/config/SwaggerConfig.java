package fooTalent.misino.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                title = "",
                description = "",
                version = "1.0.0",
                contact = @Contact(
                        name = "",
                        email = "",
                        url = ""
                )
        ),
        servers = {
                @Server(
                        description = "",
                        url = "http://localhost:8080"
                )
        }
)
public class SwaggerConfig {

    // http://localhost:8080/swagger-ui/index.html
}