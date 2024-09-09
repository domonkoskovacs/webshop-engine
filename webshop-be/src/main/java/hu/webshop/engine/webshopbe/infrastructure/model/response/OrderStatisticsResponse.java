package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.Date;

public record OrderStatisticsResponse(
        Date date,
        Double orderPriceSum,
        Integer orderCount
) {
}
