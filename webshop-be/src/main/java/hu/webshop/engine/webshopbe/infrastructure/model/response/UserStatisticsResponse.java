package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record UserStatisticsResponse(
        String email,
        Double amountOrdered
) {
}
