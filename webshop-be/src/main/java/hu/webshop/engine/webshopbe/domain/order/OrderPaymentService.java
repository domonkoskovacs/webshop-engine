package hu.webshop.engine.webshopbe.domain.order;

import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.CREATED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.PAID;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.Currency;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderPaymentService {

    private final OrderQueryService orderQueryService;
    private final StripeService stripeService;
    private final OrderRepository orderRepository;

    public PaymentIntent paymentIntent(UUID id) {
        log.info("createPaymentIntent > id: [{}]", id);
        Order order = orderQueryService.getById(id);
        if (order.getStatus().equals(CREATED) || OrderStatus.PAYMENT_FAILED.equals(order.getStatus())) {
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
}
