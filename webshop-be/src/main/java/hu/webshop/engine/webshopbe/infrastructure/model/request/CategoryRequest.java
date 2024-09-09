package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotNull;

public record CategoryRequest(
        @NotNull String name
) {
}
