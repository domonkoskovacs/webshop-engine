package hu.webshop.engine.webshopbe.domain.order;

import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
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

    public PaymentIntent intent(Intent intent) {
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

}
