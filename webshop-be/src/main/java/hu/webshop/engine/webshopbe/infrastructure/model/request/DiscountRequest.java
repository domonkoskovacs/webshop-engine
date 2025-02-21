package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.util.List;

import hu.webshop.engine.webshopbe.domain.product.value.Discount;

public record DiscountRequest(
        List<Discount> discounts
) {
}
