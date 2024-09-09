package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;


public record OrderResponse(
        UUID id,
        OffsetDateTime orderDate,
        Double totalPrice,
        AddressResponse address,
        String email,
        String phoneNumber,
        PaymentMethod paymentMethod,
        OrderStatus status,
        UUID userId,
        List<OrderItemResponse> products
) {
}
