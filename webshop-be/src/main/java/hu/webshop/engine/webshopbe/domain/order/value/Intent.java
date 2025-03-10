package hu.webshop.engine.webshopbe.domain.order.value;

import java.util.UUID;

public record Intent(
        Double amount,
        Currency currency,
        String email,
        UUID orderId
) {
}
