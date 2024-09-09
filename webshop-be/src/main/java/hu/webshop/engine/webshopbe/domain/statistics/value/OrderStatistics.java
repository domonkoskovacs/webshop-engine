package hu.webshop.engine.webshopbe.domain.statistics.value;

import java.time.LocalDate;

public record OrderStatistics(
        LocalDate date,
        Double orderPriceSum,
        Integer orderCount
) {
}
