package hu.webshop.engine.webshopbe.domain.image.entity;

import java.net.URI;

import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.image.ImageStorageStrategy;
import hu.webshop.engine.webshopbe.domain.image.StrategyRegistry;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ImageMetadataEntityListener {
    private final StrategyRegistry strategyRegistry;
    private final ImageProperties imageProperties;

    @PrePersist
    @PreUpdate
    public void preSave(ImageMetadata metadata) {
        if (metadata.getUrl() != null && metadata.getStorageType() == null) {
            String url = metadata.getUrl();
            metadata.setStorageType(isLocalUrl(url) ? ImageStorageType.LOCAL : ImageStorageType.EXTERNAL);

            if (metadata.getFilename() == null) {
                metadata.setFilename(extractFilenameFromUrl(url));
            }

            if (metadata.getExtension() == null) {
                metadata.setExtension(extractExtensionFromUrl(url));
            }
        }
    }

    @PreRemove
    public void beforeRemove(ImageMetadata metadata) {
        ImageStorageStrategy strategy = strategyRegistry.get(metadata.getStorageType());
        if (strategy != null && metadata.getFilename() != null) {
            try {
                strategy.delete(metadata.getFilename());
            } catch (Exception e) {
                log.error("Failed to delete image file: [{}]", metadata.getFilename(), e);
            }
        }
    }

    private boolean isLocalUrl(String url) {
        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            return imageProperties.getServerDomain().equalsIgnoreCase(host);
        } catch (Exception e) {
            return false;
        }
    }

    private String extractFilenameFromUrl(String url) {
        int slashIndex = url.lastIndexOf('/');
        return (slashIndex != -1 && slashIndex < url.length() - 1)
                ? url.substring(slashIndex + 1)
                : "external";
    }

    private String extractExtensionFromUrl(String url) {
        int dotIndex = url.lastIndexOf('.');
        return (dotIndex != -1 && dotIndex < url.length() - 1)
                ? url.substring(dotIndex + 1)
                : "unknown";
    }
}

