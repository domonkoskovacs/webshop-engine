package hu.webshop.engine.webshopbe.domain.statistics.value;

import java.util.List;


public record Statistics(
        List<ProductStatistics> mostSavedProducts,
        List<ProductStatistics> mostOrderedProducts,
        List<ProductStatistics> mostReturnedProducts,
        List<UserStatistics> topSpendingUsers,
        List<UserStatistics> topOrderingUsers,
        List<OrderCountStatistics> orderCounts,
        List<OrderPriceStatistics> orderPrices,
        List<WeeklyOrderStatistics> orderByDayOfWeek,
        CustomerTypeDistribution customerTypeDistribution,
        OrderStatusDistribution orderStatusDistribution,
        Double averageOrderValue,
        Double totalRevenue,
        Double totalShippingCost
) {
}
