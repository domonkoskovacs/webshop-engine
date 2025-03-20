package hu.webshop.engine.webshopbe.domain.statistics.value;

public record CustomerTypeDistribution(
        Integer newCustomers,
        Integer returningCustomers
) {
}
