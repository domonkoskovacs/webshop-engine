package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.util.List;
import java.util.UUID;

public record DeleteProductRequest(
        List<UUID> ids
) {
}
