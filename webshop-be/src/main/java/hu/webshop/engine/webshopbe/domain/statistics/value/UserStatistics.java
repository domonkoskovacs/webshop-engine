package hu.webshop.engine.webshopbe.domain.statistics.value;


public record UserStatistics(
        String email,
        String fullName,
        Double amount
) {
}
