package hu.webshop.engine.webshopbe.domain.order.filters;

import org.springframework.data.domain.Sort;

import hu.webshop.engine.webshopbe.domain.order.value.OrderSortType;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderSorting {
    public static Sort sort(OrderSortType sortType) {
        return switch (sortType) {
            case ASC_ORDER_DATE -> Sort.by(Sort.Direction.ASC, "orderDate");
            case DESC_ORDER_DATE -> Sort.by(Sort.Direction.DESC, "orderDate");
            case ASC_PRICE -> Sort.by(Sort.Direction.ASC, "totalPrice");
            case DESC_PRICE -> Sort.by(Sort.Direction.DESC, "totalPrice");
        };
    }
}
