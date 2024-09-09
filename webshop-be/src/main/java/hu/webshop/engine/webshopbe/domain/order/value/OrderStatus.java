package hu.webshop.engine.webshopbe.domain.order.value;

import java.util.List;

public enum OrderStatus {
    CREATED, PAYED, PACKAGED, SHIPPING, FINISHED, WAITING_FOR_REFUND, CANCELLED;

    public static boolean isCancelable(OrderStatus status) {
        return List.of(CREATED, PAYED, PACKAGED).contains(status);
    }
}
