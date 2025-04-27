package hu.webshop.engine.webshopbe.unit.domain.image;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.image.ImageService;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.repository.ImageMetadataRepository;
import hu.webshop.engine.webshopbe.domain.image.strategy.ImageStorageStrategyRegistry;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;

@ExtendWith(MockitoExtension.class)
@DisplayName("ImageService unit tests")
class ImageServiceTest {

    @InjectMocks
    private ImageService imageService;
    @Mock
    private ImageProperties imageProperties;
    @Mock
    private ImageMetadataRepository imageMetadataRepository;
    @Mock
    private ImageStorageStrategyRegistry strategyRegistry;

    @Test
    @DisplayName("getById throws ImageException when no strategy found")
    void getByIdThrowsImageExceptionWhenNoStrategyFound() {
        //Given
        UUID imageId = UUID.randomUUID();
        ImageMetadata metadata = ImageMetadata.builder()
                .filename("test.jpg")
                .extension("jpg")
                .storageType(ImageStorageType.LOCAL)
                .build();
        metadata.setId(imageId);
        when(imageMetadataRepository.findById(imageId)).thenReturn(Optional.of(metadata));
        when(strategyRegistry.get(metadata.getStorageType())).thenReturn(null);

        //When //Then
        assertThatThrownBy(() -> imageService.getById(imageId))
                .isInstanceOf(ImageException.class)
                .satisfies(exception -> {
                    ImageException imageException = (ImageException) exception;
                    assertThat(imageException.getResponse()).isNotNull();
                    assertThat(imageException.getResponse().error()).hasSize(1);
                    assertThat(imageException.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.IMAGE_EXCEPTION);
                    assertThat(imageException.getResponse().error().get(0).message()).contains("No strategy for storage type");
                });
    }
}
