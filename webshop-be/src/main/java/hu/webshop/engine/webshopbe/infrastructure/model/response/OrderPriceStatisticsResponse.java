package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.time.LocalDate;

public record OrderPriceStatisticsResponse(
        LocalDate date,
        double totalOrderPriceSum,
        double completedOrderPriceSum
) {
}
