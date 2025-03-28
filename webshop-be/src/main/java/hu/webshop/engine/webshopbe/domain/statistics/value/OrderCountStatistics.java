package hu.webshop.engine.webshopbe.domain.statistics.value;

import java.time.LocalDate;

public record OrderCountStatistics(
        LocalDate date,
        int totalOrderCount,
        int completedOrderCount
) {
}
