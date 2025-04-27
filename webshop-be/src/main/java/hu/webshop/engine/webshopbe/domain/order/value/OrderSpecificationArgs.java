package hu.webshop.engine.webshopbe.domain.order.value;

import java.time.LocalDate;
import java.util.List;

public record OrderSpecificationArgs(
        LocalDate minDate,
        LocalDate maxDate,
        Double minPrice,
        Double maxPrice,
        List<PaymentType> paymentTypes,
        List<OrderStatus> statuses
) {
}
