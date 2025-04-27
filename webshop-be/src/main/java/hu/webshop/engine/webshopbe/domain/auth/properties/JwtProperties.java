package hu.webshop.engine.webshopbe.domain.auth.properties;

import static hu.webshop.engine.webshopbe.domain.util.Constants.GENERATE_KEY;

import java.security.Key;
import java.util.Arrays;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Component
@Slf4j
@ConfigurationProperties("application.jwt")
public class JwtProperties {
    private int expiration;
    private int refreshExpiration;
    private String accessSecret;
    private String refreshSecret;

    private Key accessKey;
    private Key refreshKey;

    @PostConstruct
    public void initKeys() {
        if (accessSecret == null || accessSecret.isBlank() || GENERATE_KEY.equals(accessSecret)) {
            log.warn("JWT accessSecret is not set! Generating random secret key for access tokens.");
            accessSecret = generateRandomSecret();
        }
        if (refreshSecret == null || refreshSecret.isBlank() || GENERATE_KEY.equals(refreshSecret)) {
            log.warn("JWT refreshSecret is not set! Generating random secret key for refresh tokens.");
            refreshSecret = generateRandomSecret();
        }
        this.accessKey = Keys.hmacShaKeyFor(accessSecret.getBytes());
        this.refreshKey = Keys.hmacShaKeyFor(refreshSecret.getBytes());
    }

    private String generateRandomSecret() {
        return Arrays.toString(Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded());
    }
}
