package hu.webshop.engine.webshopbe.domain.order.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties("application.stripe")
public class StripeProperties {
    private boolean useTestToken;
    private String publicKey;
    private String privateKey;
}
