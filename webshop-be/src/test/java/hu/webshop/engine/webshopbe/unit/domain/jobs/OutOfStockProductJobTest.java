package hu.webshop.engine.webshopbe.unit.domain.jobs;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.jobs.OutOfStockProductJob;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.store.entity.Store;

@ExtendWith(MockitoExtension.class)
@DisplayName("OutOfStockProductJob unit tests")
class OutOfStockProductJobTest {

    @InjectMocks
    private OutOfStockProductJob outOfStockProductJob;
    @Mock
    private ProductService productService;
    @Mock
    private StoreService storeService;

    @Test
    @DisplayName("verify that job calls delete")
    void verifyThatJobCallsDelete() {
        //Given
        when(storeService.getStore()).thenReturn(Store.builder().deleteOutOfStockProducts(true).build());

        //When
        outOfStockProductJob.deleteOutOfStockProducts();

        //Then
        verify(productService, times(1)).deleteAllByStockAndDate(any(int.class), any(OffsetDateTime.class));
    }

    @Test
    @DisplayName("verify job does not call delete if store value is false")
    void verifyJobDoesNotCallDeleteIfStoreValueIsFalse() {
        //Given
        when(storeService.getStore()).thenReturn(Store.builder().deleteOutOfStockProducts(false).build());

        //When
        outOfStockProductJob.deleteOutOfStockProducts();

        //Then
        verify(productService, times(0)).deleteAllByStockAndDate(any(int.class), any(OffsetDateTime.class));
    }
}
