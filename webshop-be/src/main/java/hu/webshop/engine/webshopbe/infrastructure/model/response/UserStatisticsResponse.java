package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record UserStatisticsResponse(
        String email,
        String fullName,
        Double amount
) {
}
