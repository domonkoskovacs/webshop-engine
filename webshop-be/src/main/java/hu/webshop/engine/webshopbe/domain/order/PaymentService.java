package hu.webshop.engine.webshopbe.domain.order;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.order.properties.PaymentProperties;
import hu.webshop.engine.webshopbe.domain.order.strategy.PaymentStrategy;
import hu.webshop.engine.webshopbe.domain.order.strategy.PaymentStrategyRegistry;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.IntentSecret;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentProperties paymentProperties;
    private final PaymentStrategyRegistry paymentStrategyRegistry;

    private PaymentStrategy resolveStrategy(PaymentType requestedPaymentType) {
        if (paymentProperties.isDemoMode()) {
            return paymentStrategyRegistry.get(PaymentType.DEMO);
        }
        return paymentStrategyRegistry.get(requestedPaymentType);
    }

    public IntentSecret createIntent(Intent intent, PaymentType paymentType) {
        return resolveStrategy(paymentType).createIntent(intent);
    }

    public IntentSecret retrieveIntent(String intentId, PaymentType paymentType) {
        return resolveStrategy(paymentType).retrieveIntent(intentId);
    }

    public void cancelPaymentIntent(String paymentIntentId, PaymentType paymentType) {
        resolveStrategy(paymentType).cancelPaymentIntent(paymentIntentId);
    }

    public String createRefund(String intentId, Double totalPrice, PaymentType paymentType) {
        return resolveStrategy(paymentType).createRefund(intentId, totalPrice);
    }

}
