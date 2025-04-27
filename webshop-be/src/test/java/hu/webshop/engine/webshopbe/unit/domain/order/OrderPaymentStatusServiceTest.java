package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stripe.model.Refund;
import hu.webshop.engine.webshopbe.domain.order.OrderPaymentStatusService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderPaymentStatusServiceTest unit tests")
class OrderPaymentStatusServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderPaymentStatusService orderPaymentStatusService;

    @Test
    @DisplayName("refund success sets return completed status")
    void refundSuccessSetsReturnCompletedStatus() {
        //Given
        Refund refund = new Refund();
        refund.setId("refund123");
        Order order = Order.builder().refundId(refund.getId()).status(OrderStatus.RETURN_RECEIVED).refundedDate(null).build();
        when(orderRepository.findByRefundId(refund.getId())).thenReturn(Optional.of(order));

        //When
        orderPaymentStatusService.handleRefundSuccess(refund.getId());

        //Then
        assertThat(order.getStatus()).isEqualTo(OrderStatus.RETURN_COMPLETED);
        assertThat(order.getRefundedDate()).isNotNull();
        verify(orderRepository).save(order);
    }
}
