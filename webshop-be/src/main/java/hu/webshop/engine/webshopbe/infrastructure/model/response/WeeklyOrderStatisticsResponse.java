package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.time.DayOfWeek;

public record WeeklyOrderStatisticsResponse(
        DayOfWeek dayOfWeek,
        Integer orderCount
) {
}
