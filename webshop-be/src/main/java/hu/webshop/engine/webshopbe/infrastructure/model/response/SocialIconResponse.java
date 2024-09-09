package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.UUID;

public record SocialIconResponse(
        UUID id,
        String url,
        String icon,
        Integer position
) {
}
