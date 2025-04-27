package hu.webshop.engine.webshopbe.unit.domain.product;

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

import hu.webshop.engine.webshopbe.domain.product.CategoryService;
import hu.webshop.engine.webshopbe.domain.product.repository.CategoryRepository;
import hu.webshop.engine.webshopbe.domain.product.repository.SubCategoryRepository;
import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryServiceTest unit tests")
class CategoryServiceTest {

    @InjectMocks
    private CategoryService categoryService;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private SubCategoryRepository subCategoryRepository;

    @Test
    @DisplayName("getSubCategoryById throws exception when subcategory not found")
    void getSubCategoryByIdThrowsExceptionWhenSubcategoryNotFound() {
        //Given
        UUID subCategoryId = UUID.randomUUID();
        when(subCategoryRepository.findById(subCategoryId)).thenReturn(Optional.empty());


        //When //Then
        assertThatThrownBy(() -> categoryService.getSubCategoryById(subCategoryId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Category was not found");
    }

}
