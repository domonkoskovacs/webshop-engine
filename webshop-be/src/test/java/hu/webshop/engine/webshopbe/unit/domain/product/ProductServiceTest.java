package hu.webshop.engine.webshopbe.unit.domain.product;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.image.ImageService;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;
import hu.webshop.engine.webshopbe.domain.product.BrandService;
import hu.webshop.engine.webshopbe.domain.product.CategoryService;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Brand;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.entity.SubCategory;
import hu.webshop.engine.webshopbe.domain.product.mapper.ProductUpdateMapper;
import hu.webshop.engine.webshopbe.domain.product.repository.ProductRepository;
import hu.webshop.engine.webshopbe.domain.product.value.Gender;
import hu.webshop.engine.webshopbe.domain.product.value.ProductUpdate;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService unit tests")
class ProductServiceTest {

    @InjectMocks
    private ProductService productService;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductUpdateMapper productUpdateMapper;
    @Mock
    private BrandService brandService;
    @Mock
    private CategoryService categoryService;
    @Mock
    private ImageService imageService;
    
    @Test
    @DisplayName("delete by stock and date test")
    void deleteByStockAndDateTest() {
        //Given
        int count = 0;
        OffsetDateTime date = OffsetDateTime.now();

        //When
        productService.deleteAllByStockAndDate(count, date);

        //Then
        verify(productRepository, times(1)).findAllByCountIsLessThanEqualAndCreationTimeLessThan(any(int.class), any(OffsetDateTime.class));
    }

    @Test
    @DisplayName("getAll returns all products")
    void getAllReturnsAllProducts() {
        //Given
        when(productRepository.findAll()).thenReturn(List.of(Product.builder().build()));

        //When
        List<Product> products = productService.getAll();

        //Then
        assertThat(products).hasSizeGreaterThan(0);
    }

    @Test
    @DisplayName("update preserves existing images with valid URL")
    void updatePreservesExistingImagesWithValidUrl() {
        //Given
        UUID productId = UUID.randomUUID();
        UUID existingImageId = UUID.randomUUID();
        String validImageUrl = "http://localhost:8080/api/image/" + existingImageId;
        ImageMetadata existingImage = ImageMetadata.builder()
                .filename("test.jpg")
                .extension("jpg")
                .storageType(ImageStorageType.LOCAL)
                .build();
        existingImage.setId(existingImageId);
        List<ImageMetadata> images = new ArrayList<>();
        images.add(existingImage);
        Product oldProduct = Product.builder()
                .images(images)
                .build();
        Product updatedProduct = Product.builder()
                .images(new ArrayList<>())
                .build();
        ProductUpdate productUpdate = new ProductUpdate(
                "brand",
                "name",
                "description",
                UUID.randomUUID(),
                Gender.UNISEX,
                10,
                10.0,
                10.0,
                null,
                List.of(validImageUrl),
                "itemNo"
        );
        when(productRepository.findById(productId)).thenReturn(Optional.of(oldProduct));
        when(productUpdateMapper.update(oldProduct, productUpdate)).thenReturn(updatedProduct);
        when(categoryService.getSubCategoryById(any())).thenReturn(SubCategory.builder().build());
        when(brandService.getByName(any())).thenReturn(Brand.builder().build());
        when(productRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        //When
        Product result = productService.update(productId, productUpdate);

        //Then
        assertThat(result.getImages())
                .extracting(ImageMetadata::getId)
                .containsExactly(existingImageId);
    }
}
