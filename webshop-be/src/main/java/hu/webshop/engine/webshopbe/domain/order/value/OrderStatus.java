package hu.webshop.engine.webshopbe.domain.order.value;

public enum OrderStatus {
    // Initial order stage
    CREATED,
    // Payment outcomes
    PAYMENT_FAILED,
    PAID,
    // Order processing stages
    PROCESSING,
    PACKAGED,
    SHIPPING,
    DELIVERED,
    // Completion / Final states
    COMPLETED, // Order successfully finalized (post-delivery and return window closed)
    CANCELLED, // Order cancelled by the user (pre-shipping)
    // Refund scenarios (if cancellation occurs after payment)
    WAITING_FOR_REFUND,
    REFUNDED,
    // Return scenarios
    RETURN_REQUESTED,
    RETURN_APPROVED,
    RETURN_RECEIVED,
    RETURN_COMPLETED,
    RETURN_REJECTED;

    public boolean isCancelable() {
        return switch (this) {
            case CREATED, PAYMENT_FAILED, PAID, PROCESSING, PACKAGED -> true;
            default -> false;
        };
    }

    public boolean isReturnable() {
        // (Timeframe validation should be done outside this enum method.)
        return this == DELIVERED;
    }

    public boolean isNewStatusApplicable(OrderStatus newStatus) {
        return switch (this) {
            case CREATED -> newStatus == OrderStatus.PAID || newStatus == PAYMENT_FAILED || newStatus == OrderStatus.CANCELLED;
            case PAYMENT_FAILED -> newStatus == OrderStatus.PAID || newStatus == OrderStatus.CANCELLED;
            case PAID -> newStatus == OrderStatus.PROCESSING || newStatus == OrderStatus.WAITING_FOR_REFUND;
            case PROCESSING -> newStatus == OrderStatus.PACKAGED || newStatus == OrderStatus.WAITING_FOR_REFUND;
            case PACKAGED -> newStatus == OrderStatus.SHIPPING || newStatus == OrderStatus.WAITING_FOR_REFUND;
            case SHIPPING -> newStatus == OrderStatus.DELIVERED;
            case DELIVERED -> newStatus == OrderStatus.COMPLETED || newStatus == OrderStatus.RETURN_REQUESTED;
            case WAITING_FOR_REFUND -> newStatus == OrderStatus.REFUNDED;
            case RETURN_REQUESTED -> newStatus == OrderStatus.RETURN_APPROVED || newStatus == OrderStatus.RETURN_REJECTED;
            case RETURN_APPROVED -> newStatus == OrderStatus.RETURN_RECEIVED;
            case RETURN_RECEIVED -> newStatus == OrderStatus.RETURN_COMPLETED;

            // Final states
            case COMPLETED, CANCELLED, REFUNDED, RETURN_COMPLETED, RETURN_REJECTED -> false;
        };
    }

    public boolean shouldUpdateStock() {
        return switch (this) {
            case CANCELLED, WAITING_FOR_REFUND, RETURN_RECEIVED -> true;
            default -> false;
        };
    }

    public boolean shouldSendEmailNotification() {
        return switch (this) {
            case PAYMENT_FAILED, PAID, SHIPPING, DELIVERED, RETURN_APPROVED, RETURN_RECEIVED, RETURN_REJECTED -> true;
            default -> false;
        };
    }
}

