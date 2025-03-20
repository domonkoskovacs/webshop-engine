package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.List;

public record StatisticsResponse(
        List<ProductStatisticsResponse> mostSavedProducts,
        List<ProductStatisticsResponse> mostOrderedProducts,
        List<ProductStatisticsResponse> mostReturnedProducts,
        List<UserStatisticsResponse> topSpendingUsers,
        List<UserStatisticsResponse> topOrderingUsers,
        List<OrderStatisticsResponse> orderStatistics,
        List<WeeklyOrderStatisticsResponse> orderByDayOfWeek,
        CustomerTypeDistributionResponse customerTypeDistribution,
        OrderStatusDistributionResponse orderStatusDistribution,
        Double averageOrderValue,
        Double totalRevenue
) {
}
