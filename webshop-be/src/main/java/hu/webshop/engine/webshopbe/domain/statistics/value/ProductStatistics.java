package hu.webshop.engine.webshopbe.domain.statistics.value;

import hu.webshop.engine.webshopbe.domain.product.entity.Product;

public record ProductStatistics(
        Product product,
        Integer count
) {
}
