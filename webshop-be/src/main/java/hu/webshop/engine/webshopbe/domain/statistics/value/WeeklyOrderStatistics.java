package hu.webshop.engine.webshopbe.domain.statistics.value;

import java.time.DayOfWeek;

public record WeeklyOrderStatistics(
        DayOfWeek dayOfWeek,
        Integer orderCount
) {
}
