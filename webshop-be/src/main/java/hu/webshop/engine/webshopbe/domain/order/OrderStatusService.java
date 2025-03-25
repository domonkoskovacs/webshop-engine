package hu.webshop.engine.webshopbe.domain.order;


import java.time.Clock;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.model.Refund;
import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.order.mapper.OrderItemStockChangeMapper;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.RefundOrderItem;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.value.StockChange;
import hu.webshop.engine.webshopbe.domain.product.value.StockChangeType;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderStatusService {

    private final Clock clock;
    private final OrderRepository orderRepository;
    private final OrderQueryService orderQueryService;
    private final EmailService emailService;
    private final StripeService stripeService;
    private final StoreService storeService;
    private final OrderItemStockChangeMapper orderItemStockChangeMapper;
    private final ProductService productService;

    public Order cancel(UUID id) {
        log.info("cancel > id: [{}]", id);
        Order order = orderQueryService.getOrderFromCurrentUser(id);

        if (order.getStatus().isCancelable()) {
            if (OrderStatus.CREATED.equals(order.getStatus()) || OrderStatus.PAYMENT_FAILED.equals(order.getStatus())) {
                if (order.getPaymentIntentId() != null) {
                    stripeService.cancelPaymentIntent(order.getPaymentIntentId());
                }
                applyStatusChange(order, OrderStatus.CANCELLED);
            } else {
                Refund refund = stripeService.createRefund(order.getPaymentIntentId(), order.getTotalPrice());
                applyStatusChange(order, OrderStatus.WAITING_FOR_REFUND);
                order.setRefundId(refund.getId());
            }
            orderRepository.save(order);
            emailService.sendOrderCanceledEmail(order);
        } else {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "Can't cancel order, its status is: " + order.getStatus());
        }
        return order;
    }

    public Order returnOrder(UUID id) {
        log.info("returnOrder > id: [{}]", id);
        Order order = orderQueryService.getOrderFromCurrentUser(id);

        if (!order.getStatus().isReturnable()) {
            throw new OrderException(ReasonCode.ORDER_NOT_RETURNABLE, "Order is not in a returnable status (" + order.getStatus() + ")");
        }
        long daysSinceDelivery = ChronoUnit.DAYS.between(order.getDeliveredDate(), OffsetDateTime.now(clock));
        if (daysSinceDelivery > storeService.getStore().getReturnPeriod()) {
            throw new OrderException(ReasonCode.EXPIRED_RETURN_PERIOD, "Return period has expired.");
        }
        applyStatusChange(order, OrderStatus.RETURN_REQUESTED);
        emailService.sendReturnRequestedEmail(order);
        return order;
    }

    public Order createRefund(UUID id, List<RefundOrderItem> refundOrderItems) {
        log.info("createRefund > id: [{}], refundOrderItems: [{}]", id, refundOrderItems);

        Order order = orderQueryService.getById(id);

        Map<UUID, OrderItem> orderItemMap = order.getItems().stream().collect(Collectors.toMap(OrderItem::getId, Function.identity()));

        refundOrderItems.forEach(refundItem -> validateRefundItem(refundItem, orderItemMap));

        double totalRefundAmount = refundOrderItems.stream()
                .mapToDouble(refundItem -> {
                    OrderItem orderItem = orderItemMap.get(refundItem.orderItemId());
                    return orderItem.getIndividualPrice() * refundItem.count();
                })
                .sum();

        if (totalRefundAmount <= 0 || totalRefundAmount > order.getTotalPrice()) {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "Invalid total refund amount for order " + order.getOrderNumber());
        }

        Refund refund = stripeService.createRefund(order.getPaymentIntentId(), totalRefundAmount);
        order.setRefundId(refund.getId());
        applyStatusChange(order, OrderStatus.RETURN_RECEIVED);
        return orderRepository.save(order);
    }

    private static void validateRefundItem(RefundOrderItem refundItem, Map<UUID, OrderItem> orderItemMap) {
        OrderItem orderItem = Optional.ofNullable(orderItemMap.get(refundItem.orderItemId()))
                .orElseThrow(() -> new OrderException(ReasonCode.ORDER_EXCEPTION, "Invalid order item in refund request: " + refundItem.orderItemId()));

        if (refundItem.count() <= 0 || refundItem.count() > (orderItem.getCount() - orderItem.getReturnedCount())) {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "Invalid refund count for item: " + refundItem.orderItemId());
        }
        orderItem.setReturnedCount(orderItem.getReturnedCount() + refundItem.count());
    }

    public Order changeStatus(UUID id, OrderStatus newStatus) {
        log.info("changeStatus > id: [{}], newStatus: [{}]", id, newStatus);
        Order order = orderQueryService.getById(id);
        applyStatusChange(order, newStatus);
        orderRepository.save(order);
        return order;
    }

    private void applyStatusChange(Order order, OrderStatus newStatus) {
        order.setStatus(newStatus);
        if (order.getStatus().shouldSendEmailNotification()) {
            emailService.sendOrderStatusChangedEmail(order);
        }
        if (newStatus.shouldUpdateStock()) {
            List<StockChange> stockChanges;
            if (newStatus == OrderStatus.RETURN_RECEIVED) {
                stockChanges = orderItemStockChangeMapper.orderItemsToReturnedStockChanges(order.getItems());
            } else {
                stockChanges = orderItemStockChangeMapper.orderItemsToStockChanges(order.getItems());
            }
            productService.updateStock(stockChanges, StockChangeType.INCREMENT);
        }
        if(OrderStatus.DELIVERED.equals(order.getStatus())) {
            order.setDeliveredDate(OffsetDateTime.now());
        }
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
            cancel(order.getId());
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
