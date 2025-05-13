package hu.webshop.engine.webshopbe.domain.user.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@Component
@ConfigurationProperties("application.user")
public class UserProperties {
    private boolean demoMode;
}
