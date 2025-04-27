package hu.webshop.engine.webshopbe.domain.image.strategy;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.base.exception.GenericRuntimeException;
import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class MinioImageStorageStrategy implements ImageStorageStrategy{

    private final MinioClient minioClient;
    private final ImageProperties imageProperties;

    @PostConstruct
    public void initBucket() {
        if (imageProperties.getStorageType() != ImageStorageType.MINIO) {
            return;
        }
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(imageProperties.getMinio().getBucket()).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(imageProperties.getMinio().getBucket()).build());
            }
        } catch (Exception e) {
            throw new GenericRuntimeException("Failed to initialize MinIO bucket");
        }
    }

    @Override
    @SneakyThrows
    public ImageMetadata save(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new ImageException(ReasonCode.VALIDATION_ERROR, "Invalid file name: missing extension.");
        }
        String filename = generateFileName(originalFilename);

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(imageProperties.getMinio().getBucket())
                        .object(filename)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        return ImageMetadata.builder()
                .filename(filename)
                .extension(originalFilename.substring(originalFilename.lastIndexOf('.') + 1))
                .storageType(getStorageType())
                .build();
    }

    @Override
    @SneakyThrows
    public byte[] get(String filename) {
        return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(imageProperties.getMinio().getBucket())
                        .object(filename)
                        .build()
        ).readAllBytes();
    }

    @Override
    @SneakyThrows
    public void delete(String filename) {
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(imageProperties.getMinio().getBucket())
                        .object(filename)
                        .build()
        );
    }

    @Override
    public ImageStorageType getStorageType() {
        return ImageStorageType.MINIO;
    }

    private String generateFileName(String originalFilename) {
        return UUID.randomUUID() + "_" + originalFilename;
    }
}
