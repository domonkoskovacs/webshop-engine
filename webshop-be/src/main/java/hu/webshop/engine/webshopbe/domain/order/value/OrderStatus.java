package hu.webshop.engine.webshopbe.domain.order.value;

import java.util.List;

public enum OrderStatus {
    CREATED, PAID, PAYMENT_FAILED, PACKAGED, SHIPPING, FINISHED, WAITING_FOR_REFUND, CANCELLED, REFUNDED;

    public static boolean isCancelable(OrderStatus status) {
        return List.of(CREATED, PAID, PACKAGED).contains(status);
    }
}
