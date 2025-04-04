package hu.webshop.engine.webshopbe.domain.image;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
@RequiredArgsConstructor
public class LocalImageStorage  implements ImageStorageStrategy{

    private final ImageProperties imageProperties;
    @Getter
    private Path storageLocation;

    @PostConstruct
    public void init() {
        storageLocation = Paths.get(imageProperties.getFolderName())
                .toAbsolutePath()
                .normalize();
        try {
            Files.createDirectories(storageLocation);
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to create storage directory");
        }
    }

    @Override
    public ImageMetadata save(MultipartFile image) {
        log.info("Saving image: {}", image.getOriginalFilename());
        try {
            UUID imageId = UUID.randomUUID();
            String extension = extractExtension(image.getOriginalFilename());
            String filename = imageId + "." + extension;

            Path targetPath = storageLocation.resolve(filename);
            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return ImageMetadata.builder()
                    .filename(filename)
                    .extension(extension)
                    .storageType(ImageStorageType.LOCAL)
                    .build();

        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to save image: " + e.getMessage());
        }
    }

    @Override
    public byte[] get(String filename) {
        log.info("get > filename: [{}]", filename);
        Path filePath = storageLocation.resolve(filename);
        if (!Files.exists(filePath)) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Image file not found: " + filename);
        }
        try {
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to read image file: " + filename);
        }
    }

    @Override
    public void delete(String filename) {
        log.info("delete > filename: [{}]", filename);
        Path filePath = storageLocation.resolve(filename);
        try {
            Files.deleteIfExists(filePath);
            log.info("Deleted image file: {}", filePath);
        } catch (IOException e) {
            log.error("Error deleting file {}: {}", filePath, e.getMessage());
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to delete image: " + filename);
        }
    }

    @Override
    public ImageStorageType getStorageType() {
        return ImageStorageType.LOCAL;
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Invalid image filename: no extension");
        }
        return FilenameUtils.getExtension(originalFilename);
    }
}
