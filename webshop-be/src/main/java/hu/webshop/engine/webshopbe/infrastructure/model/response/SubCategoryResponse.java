package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.UUID;

public record SubCategoryResponse(
        UUID id,
        String name
) {
}
