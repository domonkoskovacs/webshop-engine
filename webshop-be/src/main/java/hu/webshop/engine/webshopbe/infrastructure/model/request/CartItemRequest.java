package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull UUID productId,
        @NotNull int count) {
}
