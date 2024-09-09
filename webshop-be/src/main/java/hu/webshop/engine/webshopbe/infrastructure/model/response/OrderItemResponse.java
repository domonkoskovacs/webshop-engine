package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record OrderItemResponse(
        ProductResponse product,
        Integer count
) {
}
