package hu.webshop.engine.webshopbe.infrastructure.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import hu.webshop.engine.webshopbe.domain.order.properties.StripeProperties;
import hu.webshop.engine.webshopbe.infrastructure.adapter.PaymentAdapter;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Hidden
@RestController
@RequestMapping("/api/payment/webhooks")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentAdapter paymentAdapter;
    private final StripeProperties stripeProperties;


    @PostMapping
    public ResponseEntity<Void> handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeProperties.getEndpointSecret());
        } catch (SignatureVerificationException e) {
            log.error("Signature verification failed.", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Invalid payload.", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        log.info("handleStripeEvent > Received event: [{}]", event.getType());
        paymentAdapter.handleStripeEvent(event);

        return ResponseEntity.ok().build();
    }
}
