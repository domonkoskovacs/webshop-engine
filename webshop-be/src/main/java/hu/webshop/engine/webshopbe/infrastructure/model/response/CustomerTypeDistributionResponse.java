package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record CustomerTypeDistributionResponse(
        Integer newCustomers,
        Integer returningCustomers
) {
}
