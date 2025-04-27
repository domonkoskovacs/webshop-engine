package hu.webshop.engine.webshopbe.unit.domain.image;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.base.exception.GenericRuntimeException;
import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.strategy.MinioImageStorageStrategy;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;

@ExtendWith(MockitoExtension.class)
@DisplayName("MinioImageStorageStrategy unit tests")
class MinioImageStorageStrategyTest {

    @InjectMocks
    private MinioImageStorageStrategy minioImageStorageStrategy;
    @Mock
    private MinioClient minioClient;
    @Mock
    private ImageProperties imageProperties;

    @Test
    @DisplayName("initBucket creates bucket if not found")
    void initBucketCreatesBucketIfNotFound() throws Exception {
        //Given
        when(imageProperties.getStorageType()).thenReturn(ImageStorageType.MINIO);
        ImageProperties.Minio minio = new ImageProperties.Minio();
        minio.setBucket("bucket");
        when(imageProperties.getMinio()).thenReturn(minio);
        when(minioClient.bucketExists(any())).thenReturn(false);

        //When
        minioImageStorageStrategy.initBucket();

        //Then
        verify(minioClient).makeBucket(any(MakeBucketArgs.class));
    }

    @Test
    @DisplayName("initBucket throws GenericRuntimeException on error")
    void initBucketThrowsOnError() throws Exception {
        //Given
        when(imageProperties.getStorageType()).thenReturn(ImageStorageType.MINIO);
        ImageProperties.Minio minio = new ImageProperties.Minio();
        minio.setBucket("bucket");
        when(imageProperties.getMinio()).thenReturn(minio);
        when(minioClient.bucketExists(any())).thenThrow(new RuntimeException("fail"));

        //When //Then
        assertThatThrownBy(minioImageStorageStrategy::initBucket)
                .isInstanceOf(GenericRuntimeException.class);
    }

    @Test
    @DisplayName("save throws ImageException if filename invalid")
    void saveThrowsIfFilenameInvalid() {
        //Given
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("filename_without_dot");

        //When //Then
        assertThatThrownBy(() -> minioImageStorageStrategy.save(file))
                .isInstanceOf(ImageException.class)
                .satisfies(ex -> {
                    ImageException ie = (ImageException) ex;
                    assertThat(ie.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.VALIDATION_ERROR);
                    assertThat(ie.getResponse().error().get(0).message()).contains("Invalid file name");
                });
    }


    @Test
    @DisplayName("save uploads file successfully")
    void saveUploadsSuccessfully() throws Exception {
        //Given
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("test.jpg");
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[]{}));
        when(file.getSize()).thenReturn(10L);
        when(file.getContentType()).thenReturn("image/jpeg");
        ImageProperties.Minio minio = new ImageProperties.Minio();
        minio.setBucket("bucket");
        when(imageProperties.getMinio()).thenReturn(minio);

        //When
        ImageMetadata metadata = minioImageStorageStrategy.save(file);

        //Then
        verify(minioClient).putObject(any(PutObjectArgs.class));
        assertThat(metadata.getStorageType()).isEqualTo(ImageStorageType.MINIO);
    }

    @Test
    @DisplayName("get reads file successfully")
    void getReadsFileSuccessfully() throws Exception {
        //Given
        byte[] data = "test-data".getBytes();
        GetObjectResponse response = mock(GetObjectResponse.class);
        when(response.readAllBytes()).thenReturn(data);
        when(minioClient.getObject(any(GetObjectArgs.class))).thenReturn(response);
        ImageProperties.Minio minio = new ImageProperties.Minio();
        minio.setBucket("bucket");
        when(imageProperties.getMinio()).thenReturn(minio);

        //When
        byte[] result = minioImageStorageStrategy.get("test.jpg");

        //Then
        verify(minioClient).getObject(any(GetObjectArgs.class));
        assertThat(result).isNotEmpty();
    }

    @Test
    @DisplayName("delete removes file successfully")
    void deleteRemovesSuccessfully() throws Exception {
        //Given
        ImageProperties.Minio minio = new ImageProperties.Minio();
        minio.setBucket("bucket");
        when(imageProperties.getMinio()).thenReturn(minio);

        //When
        minioImageStorageStrategy.delete("test.jpg");

        //Then
        verify(minioClient).removeObject(any(RemoveObjectArgs.class));
    }

    @Test
    @DisplayName("get throws RuntimeException if MinIO getObject fails")
    void getThrowsRuntimeExceptionIfGetObjectFails() throws Exception {
        //Given
        when(minioClient.getObject(any(GetObjectArgs.class))).thenThrow(new IOException("Minio failure"));

        ImageProperties.Minio minio = new ImageProperties.Minio();
        minio.setBucket("bucket");
        when(imageProperties.getMinio()).thenReturn(minio);

        //When //Then
        assertThatThrownBy(() -> minioImageStorageStrategy.get("test.jpg"))
                .isInstanceOf(IOException.class)
                .hasMessageContaining("Minio failure");
    }

}
