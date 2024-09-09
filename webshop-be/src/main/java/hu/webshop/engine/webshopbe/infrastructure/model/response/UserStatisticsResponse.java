package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record UserStatisticsResponse(
        UserResponse user,
        Double amountOrdered
) {
}
