package hu.webshop.engine.webshopbe.domain.statistics.value;


public record UserStatistics(
        String email,
        Double amountOrdered
) {
}
