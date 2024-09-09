package hu.webshop.engine.webshopbe.infrastructure.model.request;

import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(
        @NotNull OrderStatus orderStatus
) {
}
