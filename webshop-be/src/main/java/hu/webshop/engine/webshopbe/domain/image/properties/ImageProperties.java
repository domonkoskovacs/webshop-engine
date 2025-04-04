package hu.webshop.engine.webshopbe.domain.image.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;
import lombok.Data;

@Data
@Component
@ConfigurationProperties("application.image")
public class ImageProperties {
    private String folderName;
    private String serverDomain;
    private ImageStorageType storageType;
}
