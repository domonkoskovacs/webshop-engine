package hu.webshop.engine.webshopbe.infrastructure.model.response;

import jakarta.validation.constraints.NotNull;

public record PublicStoreResponse(
        @NotNull String name,
        @NotNull Double minOrderPrice,
        @NotNull Double shippingPrice
) {
}
