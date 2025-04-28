package hu.webshop.engine.webshopbe.domain.image;

import java.util.Objects;
import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.repository.ImageMetadataRepository;
import hu.webshop.engine.webshopbe.domain.image.strategy.ImageStorageStrategy;
import hu.webshop.engine.webshopbe.domain.image.strategy.ImageStorageStrategyRegistry;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ImageService {

    private final ImageProperties imageProperties;
    private final ImageMetadataRepository imageMetadataRepository;
    private final ImageStorageStrategyRegistry strategyRegistry;

    public ByteArrayResource getById(UUID id) {
        ImageMetadata metadata = imageMetadataRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Image metadata not found"));
        ImageStorageStrategy strategy = strategyRegistry.get(metadata.getStorageType());
        if (strategy == null) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "No strategy for storage type");
        }
        byte[] imageData = strategy.get(metadata.getFilename());
        return new ByteArrayResource(imageData);
    }

    public ImageMetadata save(MultipartFile file) {
        ImageStorageStrategy strategy = strategyRegistry.get(imageProperties.getStorageType());
        ImageMetadata metadata = strategy.save(file);
        ImageMetadata saved = imageMetadataRepository.save(metadata);
        String url = buildUrl(saved.getId());
        saved.setUrl(url);
        return imageMetadataRepository.save(saved);
    }

    private String buildUrl(UUID id) {
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();

        String host = request.getServerName();
        String protocol = request.getScheme();
        int serverPort = request.getServerPort();

        StringBuilder builder = new StringBuilder(protocol)
                .append("://")
                .append(host);

        if ("localhost".equals(host)) {
            builder.append(":").append(serverPort);
        }

        builder.append("/api/images/").append(id);

        return builder.toString();
    }

}

