package hu.webshop.engine.webshopbe.domain.auth.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties("application.jwt")
public class JwtProperties {
    private int expiration;
    private int refreshExpiration;
}
