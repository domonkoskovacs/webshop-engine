package hu.webshop.engine.webshopbe.domain.order;

import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentRetrieveParams;
import com.stripe.param.RefundCreateParams;
import hu.webshop.engine.webshopbe.domain.base.exception.StripeException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.order.properties.StripeProperties;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class StripeService {

    private final StripeProperties stripeProperties;

    @PostConstruct
    public synchronized void init() {
        Stripe.apiKey = stripeProperties.getPrivateKey();
    }

    public PaymentIntent createIntent(Intent intent) {
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
            return PaymentIntent.create(params);

        } catch (com.stripe.exception.StripeException e) {
            throw new StripeException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }

    public PaymentIntent retrieveIntent(String intentId) {
        log.info("retrieveIntent > intentId: [{}]", intentId);

        try {
            return PaymentIntent.retrieve(intentId, PaymentIntentRetrieveParams.builder().build(), null);
        } catch (com.stripe.exception.StripeException e) {
            log.error("Failed to retrieve payment intent: [{}]", intentId, e);
            throw new StripeException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }

    public Refund createRefund(String intentId, Double totalPrice) {
        log.info("createRefund > intentId: [{}], totalPrice: [{}]", intentId, totalPrice);

        try {
            long amountInCents = Math.round(totalPrice * 100);

            RefundCreateParams.Builder builder = RefundCreateParams.builder()
                    .setPaymentIntent(intentId)
                    .setAmount(amountInCents);

            RefundCreateParams params = builder.build();
            return Refund.create(params);
        } catch (com.stripe.exception.StripeException e) {
            log.error("Failed to create refund for intent: [{}]", intentId, e);
            throw new StripeException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }
}
