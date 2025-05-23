package hu.webshop.engine.webshopbe.infrastructure.adapter;

import org.springframework.stereotype.Service;

import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import hu.webshop.engine.webshopbe.domain.order.OrderPaymentStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookAdapter {

    private final OrderPaymentStatusService orderPaymentStatusService;

    public void handleStripeEvent(Event event) {
        switch (event.getType()) {
            case "payment_intent.succeeded":
                PaymentIntent paymentIntent = deserialize(event, PaymentIntent.class,
                        "Failed to deserialize PaymentIntent for succeeded event.");
                if (paymentIntent != null) {
                    orderPaymentStatusService.paymentIntentSucceeded(paymentIntent.getId());
                }
                break;
            case "payment_intent.failed":
                PaymentIntent failedIntent = deserialize(event, PaymentIntent.class,
                        "Failed to deserialize PaymentIntent for failed event.");
                if (failedIntent != null) {
                    orderPaymentStatusService.paymentIntentFailed(failedIntent.getId());
                }
                break;
            case "refund.updated":
                Refund refund = deserialize(event, Refund.class,
                        "Failed to deserialize Refund for updated event.");
                if (refund != null && "succeeded".equals(refund.getStatus())) {
                    orderPaymentStatusService.handleRefundSuccess(refund.getId());
                }
                break;
            default:
                log.warn("Unhandled event type: {}", event.getType());
                break;
        }
    }

    private <T> T deserialize(Event event, Class<T> clazz, String errorMsg) {
        return event.getDataObjectDeserializer().getObject()
                .map(clazz::cast)
                .orElseGet(() -> {
                    log.error(errorMsg);
                    return null;
                });
    }
}
