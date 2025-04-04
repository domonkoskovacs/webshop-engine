package hu.webshop.engine.webshopbe.domain.image;

import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;

public interface ImageStorageStrategy {
    ImageMetadata save(MultipartFile file);
    byte[] get(String filename);
    void delete(String filename);
    ImageStorageType getStorageType();
}
