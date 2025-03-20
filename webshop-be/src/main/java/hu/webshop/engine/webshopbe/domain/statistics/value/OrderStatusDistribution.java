package hu.webshop.engine.webshopbe.domain.statistics.value;

import hu.webshop.engine.webshopbe.domain.order.entity.Order;

public record OrderStatusDistribution(
        int pendingOrders,
        int processingOrders,
        int shippedOrders,
        int returnedOrders,
        int cancelledOrders
) {
    public static OrderStatusDistribution empty() {
        return new OrderStatusDistribution(0, 0, 0, 0, 0);
    }

    public OrderStatusDistribution accumulate(Order order) {
        int pending = this.pendingOrders;
        int processing = this.processingOrders;
        int shipped = this.shippedOrders;
        int returned = this.returnedOrders;
        int cancelled = this.cancelledOrders;

        switch (order.getStatus()) {
            case CREATED, PAYMENT_FAILED:
                pending++;
                break;
            case PAID, PROCESSING, PACKAGED:
                processing++;
                break;
            case SHIPPING, DELIVERED, COMPLETED, RETURN_REJECTED:
                shipped++;
                break;
            case RETURN_REQUESTED, RETURN_APPROVED, RETURN_RECEIVED, RETURN_COMPLETED:
                returned++;
                break;
            case CANCELLED, WAITING_FOR_REFUND, REFUNDED:
                cancelled++;
                break;
            default:
                break;
        }
        return new OrderStatusDistribution(pending, processing, shipped, returned, cancelled);
    }

    public OrderStatusDistribution combine(OrderStatusDistribution other) {
        return new OrderStatusDistribution(
                this.pendingOrders + other.pendingOrders,
                this.processingOrders + other.processingOrders,
                this.shippedOrders + other.shippedOrders,
                this.returnedOrders + other.returnedOrders,
                this.cancelledOrders + other.cancelledOrders
        );
    }
}

