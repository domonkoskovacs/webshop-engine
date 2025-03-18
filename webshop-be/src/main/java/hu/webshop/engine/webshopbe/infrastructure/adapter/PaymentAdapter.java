package hu.webshop.engine.webshopbe.infrastructure.adapter;

import org.springframework.stereotype.Service;

import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import hu.webshop.engine.webshopbe.domain.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentAdapter {

    private final OrderService orderService;

    public void paymentIntentSucceeded(PaymentIntent paymentIntent) {
        log.info("Payment intent succeeded, id: [{}]", paymentIntent.getId());
        orderService.paymentIntentSucceeded(paymentIntent);
    }

    public void paymentIntentFailed(PaymentIntent paymentIntent) {
        log.info("Processing payment intent failed for: [{}]", paymentIntent.getId());
        orderService.paymentIntentFailed(paymentIntent);
    }

    public void handleRefundSuccess(Refund refund) {
        log.info("Processing refund for charge: [{}]", refund.getId());
        orderService.handleRefundSuccess(refund);
    }
}
