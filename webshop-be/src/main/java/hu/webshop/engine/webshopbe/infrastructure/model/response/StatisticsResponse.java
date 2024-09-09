package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.List;

public record StatisticsResponse(
        List<ProductStatisticsResponse> mostSavedProducts,
        List<ProductStatisticsResponse> mostOrderedProducts,
        List<OrderStatisticsResponse> orderStatistics,
        List<UserStatisticsResponse> topUsers,
        Integer emailsSent
) {
}
