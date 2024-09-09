package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record ProductStatisticsResponse(
        ProductResponse product,
        Integer count
) {
}
