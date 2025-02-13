package hu.webshop.engine.webshopbe.unit.domain.product;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.time.OffsetDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.image.ImageService;
import hu.webshop.engine.webshopbe.domain.product.BrandService;
import hu.webshop.engine.webshopbe.domain.product.CategoryService;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.mapper.ProductUpdateMapper;
import hu.webshop.engine.webshopbe.domain.product.repository.ProductRepository;

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
        verify(productRepository, times(1)).deleteAllByCountIsLessThanEqualAndCreationTimeLessThan(any(int.class), any(OffsetDateTime.class));
    }
}
