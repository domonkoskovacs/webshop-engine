package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.UUID;

public record ArticleResponse(
        UUID id,
        String name,
        String text,
        String buttonText,
        String buttonLink,
        String imageUrl
) {
}
