package hu.webshop.engine.webshopbe.domain.order;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.model.Charge;
import hu.webshop.engine.webshopbe.domain.base.exception.StripeException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.order.properties.StripeProperties;
import hu.webshop.engine.webshopbe.domain.order.value.StripeCharge;
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

    /**
     * sends out a stripe charge, test token is used as a default
     *
     * @param charge charge data
     * @return payment info, needed to validate success
     */
    public Charge charge(StripeCharge charge) {
        log.info("charge");
        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", charge.amount().intValue());
        chargeParams.put("currency", charge.currency());
        chargeParams.put("description", charge.description());
        chargeParams.put("source", stripeProperties.isUseTestToken() ? "tok_visa" : charge.token());
        try {
            return Charge.create(chargeParams);
        } catch (com.stripe.exception.StripeException e) {
            throw new StripeException(ReasonCode.STRIPE_EXCEPTION, e.getMessage());
        }
    }
}
