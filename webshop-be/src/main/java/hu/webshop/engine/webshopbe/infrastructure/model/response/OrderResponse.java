package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;


public record OrderResponse(
        UUID id,
        OffsetDateTime orderDate,
        String orderNumber,
        Double totalPrice,
        Double shippingPrice,
        AddressResponse address,
        AddressResponse billingAddress,
        String email,
        String phoneNumber,
        PaymentType paymentType,
        OrderStatus status,
        OffsetDateTime paidDate,
        OffsetDateTime refundedDate,
        List<OrderItemResponse> items
) {
}
