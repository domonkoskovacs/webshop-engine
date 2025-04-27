package hu.webshop.engine.webshopbe.domain.order.strategy;

import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.IntentSecret;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;

public interface PaymentStrategy {
    IntentSecret createIntent(Intent intent);
    IntentSecret retrieveIntent(String intentId);
    void cancelPaymentIntent(String paymentIntentId);
    String createRefund(String intentId, Double totalPrice);
    PaymentType getPaymentType();
}
