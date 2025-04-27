package hu.webshop.engine.webshopbe.unit.domain.image;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadataEntityListener;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.strategy.ImageStorageStrategy;
import hu.webshop.engine.webshopbe.domain.image.strategy.ImageStorageStrategyRegistry;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;

@ExtendWith(MockitoExtension.class)
@DisplayName("ImageMetadataEntityListener unit tests")
class ImageMetadataEntityListenerTest {

    @InjectMocks
    private ImageMetadataEntityListener imageMetadataEntityListener;
    @Mock
    private ImageStorageStrategyRegistry strategyRegistry;
    @Mock
    private ImageProperties imageProperties;

    @Test
    @DisplayName("beforeRemove logs error if delete fails")
    void beforeRemoveLogsErrorOnDeleteFailure() {
        // Given
        ImageMetadata metadata = new ImageMetadata();
        metadata.setFilename("test.jpg");
        metadata.setStorageType(ImageStorageType.LOCAL);

        ImageStorageStrategy strategy = mock(ImageStorageStrategy.class);

        when(strategyRegistry.get(ImageStorageType.LOCAL)).thenReturn(strategy);
        doThrow(new RuntimeException("delete failed")).when(strategy).delete("test.jpg");

        // When
        imageMetadataEntityListener.beforeRemove(metadata);

        // Then
        verify(strategy).delete("test.jpg");
    }

    @Test
    @DisplayName("preSave sets storageType to EXTERNAL when isLocalUrl returns false")
    void preSaveSetsStorageTypeToExternalWhenUrlIsNotLocal() {
        // Given
        ImageMetadata metadata = new ImageMetadata();
        metadata.setUrl("https://external-site.com/images/test.jpg");
        when(imageProperties.getServerDomain()).thenReturn("webshop.com");

        // When
        imageMetadataEntityListener.preSave(metadata);

        // Then
        assertThat(metadata.getStorageType()).isEqualTo(ImageStorageType.EXTERNAL);
        assertThat(metadata.getFilename()).isEqualTo("test.jpg");
        assertThat(metadata.getExtension()).isEqualTo("jpg");
    }

    @Test
    @DisplayName("preSave sets storageType EXTERNAL if isLocalUrl throws exception")
    void preSaveSetsExternalStorageTypeOnUriException() {
        //Given
        ImageMetadata metadata = new ImageMetadata();
        metadata.setUrl("https://invalid-url%");

        //When
        imageMetadataEntityListener.preSave(metadata);

        //Then
        assertThat(metadata.getStorageType()).isEqualTo(ImageStorageType.EXTERNAL);
    }
}
