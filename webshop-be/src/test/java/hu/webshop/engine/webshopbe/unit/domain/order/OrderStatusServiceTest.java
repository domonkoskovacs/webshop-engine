package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.OrderPaymentService;
import hu.webshop.engine.webshopbe.domain.order.OrderQueryService;
import hu.webshop.engine.webshopbe.domain.order.OrderStatusService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.mapper.OrderItemStockChangeMapper;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.product.ProductService;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderStatusService unit tests")
class OrderStatusServiceTest {

    @InjectMocks
    private OrderStatusService orderStatusService;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemStockChangeMapper orderItemStockChangeMapper;
    @Mock
    private OrderPaymentService orderPaymentService;
    @Mock
    private OrderQueryService orderQueryService;
    @Mock
    private EmailService emailService;
    @Mock
    private ProductService productService;

    @Test
    @DisplayName("auto cancel order is correct")
    void autoCancelOrderIsCorrect() {
        // Given
        OffsetDateTime cutoff = OffsetDateTime.now();
        Order order1 = Order.builder().status(OrderStatus.CREATED).build();
        UUID order1Id = UUID.randomUUID();
        order1.setId(order1Id);
        Order order2 = Order.builder().status(OrderStatus.PAYMENT_FAILED).build();
        UUID order2Id = UUID.randomUUID();
        order2.setId(order2Id);
        when(orderRepository.findAllByStatusInAndOrderDateBefore(any(), any())).thenReturn(List.of(order1, order2));

        //When
        orderStatusService.autoCancelUnpaidOrders(cutoff);

        //Then
        verify(orderPaymentService, times(1)).cancel(order1Id);
        verify(orderPaymentService, times(1)).cancel(order2Id);
    }

    @Test
    @DisplayName("auto complete orders is correct")
    void autoCompleteOrdersIsCorrect() {
        //Given
        OffsetDateTime cutoff = OffsetDateTime.now();
        Order deliveredOrder = Order.builder().status(OrderStatus.DELIVERED).build();
        UUID orderId = UUID.randomUUID();
        deliveredOrder.setId(orderId);
        when(orderRepository.findAllByStatusAndOrderDateBefore(OrderStatus.DELIVERED, cutoff))
                .thenReturn(Collections.singletonList(deliveredOrder));
        when(orderQueryService.getById(orderId)).thenReturn(deliveredOrder);
        when(orderRepository.save(deliveredOrder)).thenReturn(deliveredOrder);

        //When
        orderStatusService.autoCompleteDeliveredOrders(cutoff);

        //Then
        verify(orderQueryService, times(1)).getById(orderId);
        verify(orderRepository, times(1)).save(deliveredOrder);
    }

    @Test
    @DisplayName("auto cancel handles error")
    void autoCancelHandlesError() {
        //Given
        OffsetDateTime cutoff = OffsetDateTime.now();
        Order order = Order.builder().status(OrderStatus.CREATED).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        when(orderRepository.findAllByStatusInAndOrderDateBefore(any(), any()))
                .thenReturn(Collections.singletonList(order));
        doThrow(new RuntimeException())
                .when(orderPaymentService).cancel(orderId);

        //When //Then
        assertThatCode(() -> orderStatusService.autoCancelUnpaidOrders(cutoff))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("auto complete handles error")
    void autoCompleteHandlesError() {
        //Given
        OffsetDateTime cutoff = OffsetDateTime.now();
        Order order = Order.builder().status(OrderStatus.DELIVERED).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        when(orderRepository.findAllByStatusAndOrderDateBefore(OrderStatus.DELIVERED, cutoff))
                .thenReturn(Collections.singletonList(order));
        when(orderQueryService.getById(orderId))
                .thenThrow(new RuntimeException());

        //When //Then
        assertThatCode(() -> orderStatusService.autoCompleteDeliveredOrders(cutoff))
                .doesNotThrowAnyException();
    }

}
