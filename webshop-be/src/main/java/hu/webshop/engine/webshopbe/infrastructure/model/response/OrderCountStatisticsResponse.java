package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.time.LocalDate;

public record OrderCountStatisticsResponse(
        LocalDate date,
        int totalOrderCount,
        int completedOrderCount
) {
}
