package hu.webshop.engine.webshopbe.unit.domain.jobs;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.image.ImageCleanUpService;
import hu.webshop.engine.webshopbe.domain.jobs.UnusedImagesJob;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.store.entity.Store;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderStatusJob unit tests")
class UnusedImagesJobTest {

    @InjectMocks
    private UnusedImagesJob unusedImagesJob;
    @Mock
    private StoreService storeService;
    @Mock
    private ImageCleanUpService imageCleanUpService;

    @Test
    @DisplayName("verify delete unused images called if enabled")
    void verifyDeleteUnusedImagesCalledIfEnabled() {
        //Given
        when(storeService.getStore()).thenReturn(Store.builder().deleteUnusedPictures(true).build());

        //When
        unusedImagesJob.deleteUnusedImages();

        //Then
        verify(imageCleanUpService, times(1)).deleteUnusedImages();
    }

    @Test
    @DisplayName("verify delete unused images not called if not enabled")
    void verifyDeleteUnusedImagesNotCalledIfNotEnabled() {
        //Given
        when(storeService.getStore()).thenReturn(Store.builder().deleteUnusedPictures(false).build());

        //When
        unusedImagesJob.deleteUnusedImages();

        //Then
        verify(imageCleanUpService, times(0)).deleteUnusedImages();
    }
}
