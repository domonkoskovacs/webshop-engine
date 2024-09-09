package hu.webshop.engine.webshopbe.domain.statistics.value;

import java.util.List;

import hu.webshop.engine.webshopbe.domain.statistics.dto.ProductStatistics;


public record Statistics(
        List<ProductStatistics> mostSavedProducts,
        List<ProductStatistics> mostOrderedProducts,
        List<OrderStatistics> orderStatistics,
        List<UserStatistics> topUsers,
        Integer emailsSent
) {
}
