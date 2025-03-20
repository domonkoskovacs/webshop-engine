package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record RefundOrderItemRequest(
        @NotNull UUID orderItemId,
        @NotNull Integer count
) {
}
