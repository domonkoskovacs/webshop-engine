package hu.webshop.engine.webshopbe.domain.order.value;

public record StripeCharge(
        String description,
        Double amount,
        Currency currency,
        String stripeEmail,
        String token
) {
}
