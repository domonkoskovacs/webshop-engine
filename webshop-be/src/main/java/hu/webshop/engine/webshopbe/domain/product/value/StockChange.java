package hu.webshop.engine.webshopbe.domain.product.value;

import java.util.UUID;

public record StockChange(
        UUID productId,
        Integer count
) {
}
