package hu.webshop.engine.webshopbe.domain.order;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.mapper.OrderItemStockChangeMapper;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.value.StockChangeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderStatusService {

    private final OrderRepository orderRepository;
    private final OrderItemStockChangeMapper orderItemStockChangeMapper;
    private final OrderPaymentService orderPaymentService;
    private final OrderQueryService orderQueryService;
    private final EmailService emailService;
    private final ProductService productService;

    public Order changeStatus(UUID id, OrderStatus newStatus) {
        log.info("changeStatus > id: [{}], newStatus: [{}]", id, newStatus);
        Order order = orderQueryService.getById(id);
        order.setStatus(newStatus);
        if (order.getStatus().shouldSendEmailNotification()) {
            emailService.sendOrderStatusChangedEmail(order);
        }
        if (order.getStatus().shouldUpdateStock()) {
            productService.updateStock(
                    orderItemStockChangeMapper.orderItemsToStockChanges(order.getItems()),
                    StockChangeType.INCREMENT);
        }
        orderRepository.save(order);
        return order;
    }

    public void autoCancelUnpaidOrders(OffsetDateTime cutoff) {
        orderRepository.findAllByStatusInAndOrderDateBefore(
                Arrays.asList(OrderStatus.CREATED, OrderStatus.PAYMENT_FAILED),
                cutoff).forEach(this::cancelOrder);
    }

    public void autoCompleteDeliveredOrders(OffsetDateTime cutoff) {
        orderRepository.findAllByStatusAndOrderDateBefore(OrderStatus.DELIVERED, cutoff)
                .forEach(this::completeOrder);
    }

    private void cancelOrder(Order order) {
        try {
            orderPaymentService.cancel(order.getId());
        } catch (Exception e) {
            log.error("Error cancelling order {}: {}", order.getId(), e.getMessage());
        }
    }

    private void completeOrder(Order order) {
        try {
            changeStatus(order.getId(), OrderStatus.COMPLETED);
        } catch (Exception e) {
            log.error("Error finishing order {}: {}", order.getId(), e.getMessage());
        }
    }
}
