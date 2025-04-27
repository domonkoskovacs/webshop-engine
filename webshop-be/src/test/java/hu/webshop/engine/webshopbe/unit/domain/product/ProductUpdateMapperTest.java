package hu.webshop.engine.webshopbe.unit.domain.product;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.product.mapper.ProductUpdateMapper;
import hu.webshop.engine.webshopbe.domain.product.mapper.ProductUpdateMapperImpl;

@DisplayName("ProductUpdateMapper unit tests")
class ProductUpdateMapperTest {

    private final ProductUpdateMapper mapper = new ProductUpdateMapperImpl();


    @Test
    @DisplayName("toImageMetadataList returns empty list when input is null")
    void toImageMetadataListReturnsEmptyListWhenInputIsNull() {
        //Given
        String imageUrls = null;

        //When
        List<ImageMetadata> result = mapper.toImageMetadataList(imageUrls);

        //Then
        assertThat(result).isEmpty();
    }


    @Test
    @DisplayName("toImageMetadataList returns empty list when input is empty")
    void toImageMetadataListReturnsEmptyListWhenInputIsEmpty() {
        //Given
        String imageUrls = "   ";

        //When
        List<ImageMetadata> result = mapper.toImageMetadataList(imageUrls);

        //Then
        assertThat(result).isEmpty();
    }
}
