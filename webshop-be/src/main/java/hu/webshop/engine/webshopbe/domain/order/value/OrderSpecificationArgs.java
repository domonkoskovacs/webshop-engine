package hu.webshop.engine.webshopbe.domain.order.value;

import java.time.OffsetDateTime;
import java.util.List;

public record OrderSpecificationArgs(
        OffsetDateTime minDate,
        OffsetDateTime maxDate,
        Double minPrice,
        Double maxPrice,
        List<PaymentMethod> paymentMethods,
        List<OrderStatus> statuses
) {
}
