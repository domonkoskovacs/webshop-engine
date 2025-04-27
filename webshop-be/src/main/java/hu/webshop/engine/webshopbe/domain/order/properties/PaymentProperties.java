package hu.webshop.engine.webshopbe.domain.order.properties;

import static hu.webshop.engine.webshopbe.domain.util.Constants.PRODUCTION_PROFILE;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@Component
@ConfigurationProperties("application.payment")
public class PaymentProperties {
    private boolean demoMode;
    private String privateKey;
    private String endpointSecret;

    @PostConstruct
    public void validateAndInitialize() {
        if ((privateKey == null || privateKey.isBlank()) || (endpointSecret == null || endpointSecret.isBlank())) {
            demoMode = true;
            log.warn("Stripe configuration missing. Switching to demo payment mode!");
        }

        String activeProfile = System.getProperty("spring.profiles.active");
        if (PRODUCTION_PROFILE.equals(activeProfile) && demoMode) {
            throw new IllegalStateException("Demo payment mode is not allowed in production!");
        }
    }
}
