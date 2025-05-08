package hu.webshop.engine.webshopbe.domain.order.strategy;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.IntentSecret;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DemoPaymentStrategy implements PaymentStrategy {

    private final PaymentStatusProxyInvoker paymentStatusProxyInvoker;

    @Override
    public IntentSecret createIntent(Intent intent) {
        log.info("createIntent > intent: [{}]", intent);
        String demoIntentId = "demo_" + UUID.randomUUID();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                log.info("Triggering order payment success after transaction commit for orderId: [{}]", intent.orderId());
                paymentStatusProxyInvoker.invokePaymentSuccess(demoIntentId);
            }
        });
        return new IntentSecret(demoIntentId, "demo_client_secret_" + demoIntentId);
    }

    @Override
    public IntentSecret retrieveIntent(String intentId) {
        log.info("retrieveIntent > intentId: [{}]", intentId);
        return new IntentSecret(intentId, "demo_client_secret_" + intentId);
    }

    @Override
    public void cancelPaymentIntent(String paymentIntentId) {
        log.info("cancelPaymentIntent > paymentIntentId: [{}]", paymentIntentId);
    }

    @Override
    public String createRefund(String intentId, Double totalPrice) {
        log.info("createRefund > intentId: [{}], totalPrice: [{}]", intentId, totalPrice);
        String refundId = "demo_refund_" + UUID.randomUUID();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                log.info("Triggering refund success after transaction commit for refundId: [{}]", refundId);
                paymentStatusProxyInvoker.invokeRefundSuccess(refundId);
            }
        });
        return refundId;
    }

    @Override
    public PaymentType getPaymentType() {
        return PaymentType.DEMO;
    }
}
