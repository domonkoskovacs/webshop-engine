package hu.webshop.engine.webshopbe.domain.order;

import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.CREATED;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.Currency;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.IntentSecret;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderPaymentService {

    private final OrderQueryService orderQueryService;
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;

    public IntentSecret paymentIntent(UUID id) {
        log.info("createPaymentIntent > id: [{}]", id);
        Order order = orderQueryService.getByIdForUpdate(id);
        if (order.getStatus().equals(CREATED) || OrderStatus.PAYMENT_FAILED.equals(order.getStatus())) {
            IntentSecret intent;
            if (order.getPaymentIntentId() == null) {
                intent = paymentService.createIntent(
                        new Intent(order.getTotalPrice(), Currency.USD, order.getUser().getEmail(), order.getId()),
                        order.getPaymentType());
                order.setPaymentIntentId(intent.id());
                orderRepository.save(order);
            } else {
                intent = paymentService.retrieveIntent(order.getPaymentIntentId(), order.getPaymentType());
            }
            return intent;
        } else {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "already paid");
        }
    }
}
