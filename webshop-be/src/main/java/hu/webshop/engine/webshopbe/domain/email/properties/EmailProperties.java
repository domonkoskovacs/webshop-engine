package hu.webshop.engine.webshopbe.domain.email.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties("application.email")
public class EmailProperties {
    private String newPassword;
    private String verify;
    private String moreInfo;
    private String unsubscribe;
    private String from;
}
