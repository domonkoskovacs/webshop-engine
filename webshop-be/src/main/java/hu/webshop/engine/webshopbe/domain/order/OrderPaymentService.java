package hu.webshop.engine.webshopbe.domain.order;


import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.CREATED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.PAID;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.order.mapper.OrderItemStockChangeMapper;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.Currency;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.RefundOrderItem;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.value.StockChangeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderPaymentService {

    private final OrderRepository orderRepository;
    private final OrderItemStockChangeMapper orderItemStockChangeMapper;
    private final OrderQueryService orderQueryService;
    private final EmailService emailService;
    private final StripeService stripeService;
    private final ProductService productService;

    public PaymentIntent paymentIntent(UUID id) {
        log.info("createPaymentIntent > id: [{}]", id);
        Order order = orderQueryService.getById(id);
        if (order.getStatus().equals(CREATED)) {
            PaymentIntent intent;
            if (order.getPaymentIntentId() == null) {
                intent = stripeService.createIntent(
                        new Intent(order.getTotalPrice(), Currency.USD, order.getUser().getEmail(), order.getId())
                );
                order.setPaymentIntentId(intent.getId());
                orderRepository.save(order);
            } else {
                intent = stripeService.retrieveIntent(order.getPaymentIntentId());
            }
            return intent;
        } else {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "already paid");
        }
    }

    public Order cancel(UUID id) {
        log.info("cancel > id: [{}]", id);
        Order order = orderQueryService.getOrderFromCurrentUser(id);

        if (order.getStatus().isCancelable()) {
            if (OrderStatus.CREATED.equals(order.getStatus())) {
                if (order.getPaymentIntentId() != null) {
                    stripeService.cancelPaymentIntent(order.getPaymentIntentId());
                }
                order.setStatus(OrderStatus.CANCELLED);
            } else {
                Refund refund = stripeService.createRefund(order.getPaymentIntentId(), order.getTotalPrice());
                order.setRefundId(refund.getId());
                order.setStatus(OrderStatus.WAITING_FOR_REFUND);
            }
            orderRepository.save(order);
            productService.updateStock(
                    orderItemStockChangeMapper.orderItemsToStockChanges(order.getItems()),
                    StockChangeType.INCREMENT);
            emailService.sendOrderCanceledEmail(order);
        } else {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "Can't cancel order, its status is: " + order.getStatus());
        }
        return order;
    }

    public void paymentIntentSucceeded(PaymentIntent paymentIntent) {
        Optional<Order> orderByPaymentIntentId = orderRepository.findByPaymentIntentId(paymentIntent.getId());
        orderByPaymentIntentId.ifPresent(order -> {
            if ((CREATED.equals(order.getStatus()) || OrderStatus.PAYMENT_FAILED.equals(order.getStatus())) && order.getPaidDate() == null) {
                order.setStatus(PAID);
                order.setPaidDate(OffsetDateTime.now());
            }
            orderRepository.save(order);
        });
    }

    public void paymentIntentFailed(PaymentIntent paymentIntent) {
        Optional<Order> orderByPaymentIntentId = orderRepository.findByPaymentIntentId(paymentIntent.getId());
        orderByPaymentIntentId.ifPresent(order -> {
            if (CREATED.equals(order.getStatus())) {
                order.setStatus(OrderStatus.PAYMENT_FAILED);
            }
            orderRepository.save(order);
        });
    }

    public void handleRefundSuccess(Refund refund) {
        Optional<Order> orderOpt = orderRepository.findByRefundId(refund.getId());
        orderOpt.ifPresent(order -> {
            if (order.getRefundedDate() == null) {
                if (order.getStatus() == OrderStatus.WAITING_FOR_REFUND) {
                    order.setStatus(OrderStatus.REFUNDED);
                } else if (order.getStatus() == OrderStatus.RETURN_RECEIVED) {
                    order.setStatus(OrderStatus.RETURN_COMPLETED);
                }
                order.setRefundedDate(OffsetDateTime.now());
                orderRepository.save(order);
            }
        });
    }

    public Order returnOrder(UUID id) {
        log.info("returnOrder > id: [{}]", id);
        Order order = orderQueryService.getOrderFromCurrentUser(id);
        order.setStatus(OrderStatus.RETURN_REQUESTED);
        orderRepository.save(order);
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
        order.setStatus(OrderStatus.RETURN_RECEIVED);
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
}
