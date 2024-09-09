package hu.webshop.engine.webshopbe.domain.image.value;

import java.util.UUID;

public record ImageIdentifier(
        UUID imageId, String originalFilename
) {
}
