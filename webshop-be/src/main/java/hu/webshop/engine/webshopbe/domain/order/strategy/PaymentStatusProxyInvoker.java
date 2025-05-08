package hu.webshop.engine.webshopbe.domain.order.strategy;


import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.order.OrderPaymentStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentStatusProxyInvoker {

    private final OrderPaymentStatusService orderPaymentStatusService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void invokePaymentSuccess(String paymentIntentId) {
        log.info("invokePaymentSuccess > paymentIntentId: [{}]", paymentIntentId);
        orderPaymentStatusService.paymentIntentSucceeded(paymentIntentId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void invokeRefundSuccess(String refundId) {
        log.info("invokeRefundSuccess > refundId: [{}]", refundId);
        orderPaymentStatusService.handleRefundSuccess(refundId);
    }
}
