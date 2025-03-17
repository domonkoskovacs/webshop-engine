package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.product.value.Gender;

public record OrderItemResponse(
        String productName,
        Double individualPrice,
        String thumbNailUrl,
        Gender gender,
        String categoryName,
        String subcategoryName,
        UUID productId,
        Integer count
) {
}
