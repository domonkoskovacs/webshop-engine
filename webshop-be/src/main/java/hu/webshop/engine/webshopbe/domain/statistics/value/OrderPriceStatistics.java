package hu.webshop.engine.webshopbe.domain.statistics.value;

import java.time.LocalDate;

public record OrderPriceStatistics(
        LocalDate date,
        double totalOrderPriceSum,
        double completedOrderPriceSum
) {
}
