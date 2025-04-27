package hu.webshop.engine.webshopbe.domain.order.strategy;

import org.springframework.stereotype.Component;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCancelParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentRetrieveParams;
import com.stripe.param.RefundCreateParams;
import hu.webshop.engine.webshopbe.domain.base.exception.PaymentException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.order.properties.PaymentProperties;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.IntentSecret;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class StripePaymentStrategy implements PaymentStrategy {

    private final PaymentProperties stripeProperties;

    @PostConstruct
    public synchronized void init() {
        Stripe.apiKey = stripeProperties.getPrivateKey();
    }

    @Override
    public IntentSecret createIntent(Intent intent) {
        log.info("intent > intent: [{}]", intent);

        try {
            long amountInCents = Math.round(intent.amount() * 100);

            PaymentIntentCreateParams.Builder builder = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(intent.currency().toString())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .putMetadata("order_id", intent.orderId().toString());

            if (intent.email() != null) {
                builder.setReceiptEmail(intent.email());
            }

            PaymentIntentCreateParams params = builder.build();
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return new IntentSecret(paymentIntent.getId(), paymentIntent.getClientSecret());

        } catch (StripeException e) {
            throw new PaymentException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }

    @Override
    public IntentSecret retrieveIntent(String intentId) {
        log.info("retrieveIntent > intentId: [{}]", intentId);
        PaymentIntent intent = getIntent(intentId);
        return new IntentSecret(intentId, intent.getClientSecret());
    }

    @Override
    public void cancelPaymentIntent(String paymentIntentId) {
        log.info("cancelPaymentIntent > paymentIntentId: [{}]", paymentIntentId);
        try {
            PaymentIntent intent = getIntent(paymentIntentId);
            if ("succeeded".equals(intent.getStatus())) {
                log.warn("PaymentIntent [{}] already succeeded and cannot be canceled.", paymentIntentId);
                throw new PaymentException(ReasonCode.PAYMENT_ALREADY_SUCCEEDED,
                        "Cannot cancel a payment intent that already succeeded.");
            }
            PaymentIntentCancelParams params = PaymentIntentCancelParams.builder().build();
            intent.cancel(params);
        } catch (StripeException e) {
            log.error("Failed to cancel PaymentIntent: [{}]", paymentIntentId, e);
            throw new PaymentException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }

    @Override
    public String createRefund(String intentId, Double totalPrice) {
        log.info("createRefund > intentId: [{}], totalPrice: [{}]", intentId, totalPrice);
        try {
            long amountInCents = Math.round(totalPrice * 100);

            RefundCreateParams.Builder builder = RefundCreateParams.builder()
                    .setPaymentIntent(intentId)
                    .setAmount(amountInCents);

            RefundCreateParams params = builder.build();
            Refund refund = Refund.create(params);
            return refund.getId();
        } catch (StripeException e) {
            log.error("Failed to create refund for intent: [{}]", intentId, e);
            throw new PaymentException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }

    @Override
    public PaymentType getPaymentType() {
        return PaymentType.STRIPE;
    }

    private PaymentIntent getIntent(String intentId) {
        try {
            return PaymentIntent.retrieve(intentId, PaymentIntentRetrieveParams.builder().build(), null);
        } catch (StripeException e) {
            log.error("Failed to retrieve payment intent: [{}]", intentId, e);
            throw new PaymentException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }
}
