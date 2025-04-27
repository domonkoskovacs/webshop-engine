package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.OrderQueryService;
import hu.webshop.engine.webshopbe.domain.order.OrderStatusService;
import hu.webshop.engine.webshopbe.domain.order.PaymentService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.order.mapper.OrderItemStockChangeMapper;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;
import hu.webshop.engine.webshopbe.domain.order.value.RefundOrderItem;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.store.entity.Store;

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
    private OrderQueryService orderQueryService;
    @Mock
    private EmailService emailService;
    @Mock
    private ProductService productService;
    @Mock
    private StoreService storeService;
    @Mock
    private Clock clock;
    @Mock
    private PaymentService paymentService;

    @Test
    @DisplayName("paid order cancellation results in a refund")
    void paidOrderCancellationResultsInARefund() {
        //Given
        String paymentIntentId = UUID.randomUUID().toString();
        Double totalAmount = 100.0;
        Order order = Order.builder().status(OrderStatus.PAID).paymentIntentId(paymentIntentId).totalPrice(totalAmount).paymentType(PaymentType.DEMO).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        String refundId = UUID.randomUUID().toString();
        when(paymentService.createRefund(any(), any(), any())).thenReturn(refundId);
        when(orderQueryService.getOrderFromCurrentUser(orderId)).thenReturn(order);

        //When
        Order cancel = orderStatusService.cancel(orderId);

        //Then
        assertThat(cancel.getStatus()).isEqualTo(OrderStatus.WAITING_FOR_REFUND);
        assertThat(cancel.getRefundId()).isNotNull();
        verify(paymentService, times(1)).createRefund(paymentIntentId, totalAmount, PaymentType.DEMO);
    }

    @Test
    @DisplayName("order not cancellable throws exception")
    void orderNotCancellableThrowsException() {
        //Given
        Order order = Order.builder().status(OrderStatus.DELIVERED).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        when(orderQueryService.getOrderFromCurrentUser(orderId)).thenReturn(order);

        //When //Then
        assertThatThrownBy(() -> orderStatusService.cancel(orderId))
                .isInstanceOf(OrderException.class)
                .extracting(ex -> ((OrderException) ex).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.ORDER_EXCEPTION);
    }

    @Test
    @DisplayName("cancel order cancels intent")
    void cancelOrderCancelsIntent() {
        //Given
        String paymentIntentId = UUID.randomUUID().toString();
        Order order = Order.builder().status(OrderStatus.CREATED).paymentIntentId(paymentIntentId).paymentType(PaymentType.DEMO).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        when(orderQueryService.getOrderFromCurrentUser(orderId)).thenReturn(order);

        //When
        orderStatusService.cancel(orderId);

        //Then
        verify(paymentService, times(1)).cancelPaymentIntent(paymentIntentId, PaymentType.DEMO);
    }

    @Test
    @DisplayName("exception thrown when returned period closed")
    void exceptionThrownWhenReturnedPeriodClosed() {
        //Given
        when(clock.instant()).thenReturn(Instant.parse("2025-03-25T00:00:00Z"));
        when(clock.getZone()).thenReturn(ZoneId.systemDefault());
        Store store = Store.builder().returnPeriod(10).build();
        Order order = Order.builder().status(OrderStatus.DELIVERED)
                .deliveredDate(OffsetDateTime.now(clock).minusDays(20))
                .build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        when(orderQueryService.getOrderFromCurrentUser(orderId)).thenReturn(order);
        when(storeService.getStore()).thenReturn(store);

        //When //Then
        assertThatThrownBy(() -> orderStatusService.returnOrder(orderId))
                .isInstanceOf(OrderException.class)
                .extracting(ex -> ((OrderException) ex).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.EXPIRED_RETURN_PERIOD);
    }

    @Test
    @DisplayName("order not returnable with bad status")
    void orderNotReturnableWithBadStatus() {
        //Given
        Order order = Order.builder().status(OrderStatus.CREATED).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        when(orderQueryService.getOrderFromCurrentUser(orderId)).thenReturn(order);

        //When //Then
        assertThatThrownBy(() -> orderStatusService.returnOrder(orderId))
                .isInstanceOf(OrderException.class)
                .extracting(ex -> ((OrderException) ex).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.ORDER_NOT_RETURNABLE);
    }

    @Test
    @DisplayName("invalid refund amount")
    void invalidRefundAmount() {
        //Given
        UUID orderId = UUID.randomUUID();
        UUID orderItemId = UUID.randomUUID();
        Order order = Order.builder().status(OrderStatus.SHIPPING).totalPrice(10.0).build();
        order.setId(orderId);
        OrderItem orderItem = OrderItem.builder().count(2).returnedCount(0).individualPrice(10.0).build();
        orderItem.setId(orderItemId);
        order.setItems(List.of(orderItem));
        List<RefundOrderItem> refundOrderItems = List.of(new RefundOrderItem(orderItemId, 2));
        when(orderQueryService.getById(orderId)).thenReturn(order);

        //When //Then
        assertThatThrownBy(() -> orderStatusService.createRefund(orderId, refundOrderItems))
                .isInstanceOf(OrderException.class);
    }

    @Test
    @DisplayName("validation catches too many refund item")
    void validationCatchesTooManyRefundItem() {
        //Given
        Order order = Order.builder().status(OrderStatus.SHIPPING).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        UUID orderItemId = UUID.randomUUID();
        OrderItem orderItem = OrderItem.builder().count(1).build();
        orderItem.setId(orderItemId);
        order.setItems(List.of(orderItem));
        List<RefundOrderItem> refundOrderItems = List.of(new RefundOrderItem(orderItemId, 10));
        when(orderQueryService.getById(orderId)).thenReturn(order);

        //When //Then
        assertThatThrownBy(() -> orderStatusService.createRefund(orderId, refundOrderItems))
                .isInstanceOf(OrderException.class);
    }

    @Test
    @DisplayName("apply status change sets delivered date")
    void applyStatusChangeSetsDeliveredDate() {
        //Given
        Order order = Order.builder().status(OrderStatus.SHIPPING).build();
        UUID orderId = UUID.randomUUID();
        order.setId(orderId);
        when(orderQueryService.getById(orderId)).thenReturn(order);

        //When
        Order saved = orderStatusService.changeStatus(order.getId(), OrderStatus.DELIVERED);

        //Then
        assertThat(saved.getStatus()).isEqualTo(OrderStatus.DELIVERED);
        assertThat(order.getDeliveredDate()).isNotNull();
    }

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
        when(orderQueryService.getOrderFromCurrentUser(order1Id)).thenReturn(order1);
        when(orderQueryService.getOrderFromCurrentUser(order2Id)).thenReturn(order2);

        //When
        orderStatusService.autoCancelUnpaidOrders(cutoff);

        //Then
        verify(emailService, times(2)).sendOrderCanceledEmail(any());
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
                .when(orderQueryService).getOrderFromCurrentUser(orderId);

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
