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

import hu.webshop.engine.webshopbe.domain.jobs.OrderStatusJob;
import hu.webshop.engine.webshopbe.domain.order.OrderStatusService;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.store.entity.Store;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderStatusJob unit tests")
class OrderStatusJobTest {

    @InjectMocks
    private OrderStatusJob orderStatusJob;
    @Mock
    private StoreService storeService;
    @Mock
    private OrderStatusService orderStatusService;

    @Test
    @DisplayName("verify auto cancel is called")
    void verifyAutoCancelIsCalled() {
        //Given
        when(storeService.getStore()).thenReturn(Store.builder().unpaidOrderCancelHours(1).build());

        //When
        orderStatusJob.autoCancelUnpaidOrders();

        //Then
        verify(orderStatusService, times(1)).autoCancelUnpaidOrders(any(OffsetDateTime.class));
    }

    @Test
    @DisplayName("verify auto complete is called")
    void verifyAutoCompleteIsCalled() {
        //Given
        when(storeService.getStore()).thenReturn(Store.builder().returnPeriod(1).build());

        //When
        orderStatusJob.autoCompleteDeliveredOrders();

        //Then
        verify(orderStatusService, times(1)).autoCompleteDeliveredOrders(any(OffsetDateTime.class));
    }
}
