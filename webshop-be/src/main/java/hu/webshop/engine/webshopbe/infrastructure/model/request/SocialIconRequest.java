package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotNull;

public record SocialIconRequest(
        @NotNull String url,
        @NotNull String icon,
        @NotNull Integer position
) {
}
