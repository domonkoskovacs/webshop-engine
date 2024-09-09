package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.UUID;

public record BrandResponse(
        UUID id,
        String name
) {
}
