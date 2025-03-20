package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record OrderStatusDistributionResponse(
        Integer pendingOrders,
        Integer processingOrders,
        Integer shippedOrders,
        Integer returnedOrders,
        Integer cancelledOrders
) {
}
