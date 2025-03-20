package hu.webshop.engine.webshopbe.domain.order.value;

import java.util.UUID;

public record RefundOrderItem(
        UUID orderItemId,
        Integer count
) {
}
