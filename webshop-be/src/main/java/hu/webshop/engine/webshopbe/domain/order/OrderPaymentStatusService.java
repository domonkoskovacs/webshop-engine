package hu.webshop.engine.webshopbe.domain.order;

import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.CREATED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.PAID;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderPaymentStatusService {

    private final OrderRepository orderRepository;

    public void paymentIntentSucceeded(String paymentIntentId) {
        Optional<Order> orderByPaymentIntentId = orderRepository.findByPaymentIntentId(paymentIntentId);
        orderByPaymentIntentId.ifPresent(order -> {
            if ((CREATED.equals(order.getStatus()) || OrderStatus.PAYMENT_FAILED.equals(order.getStatus())) && order.getPaidDate() == null) {
                order.setStatus(PAID);
                order.setPaidDate(OffsetDateTime.now());
            }
            orderRepository.save(order);
        });
    }

    public void paymentIntentFailed(String paymentIntentId) {
        Optional<Order> orderByPaymentIntentId = orderRepository.findByPaymentIntentId(paymentIntentId);
        orderByPaymentIntentId.ifPresent(order -> {
            if (CREATED.equals(order.getStatus())) {
                order.setStatus(OrderStatus.PAYMENT_FAILED);
            }
            orderRepository.save(order);
        });
    }

    public void handleRefundSuccess(String refundId) {
        Optional<Order> orderOpt = orderRepository.findByRefundId(refundId);
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
}
