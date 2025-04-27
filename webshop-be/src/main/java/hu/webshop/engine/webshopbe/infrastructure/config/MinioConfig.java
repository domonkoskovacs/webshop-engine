package hu.webshop.engine.webshopbe.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class MinioConfig {

    private final ImageProperties imageProperties;

    @Bean
    public MinioClient minioClient() {
        ImageProperties.Minio minio = imageProperties.getMinio();
        return MinioClient.builder()
                .endpoint(minio.getEndpoint())
                .credentials(minio.getAccessKey(), minio.getSecretKey())
                .build();
    }
}
