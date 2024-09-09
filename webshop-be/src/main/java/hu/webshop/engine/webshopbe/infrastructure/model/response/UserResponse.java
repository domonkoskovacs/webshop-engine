package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.List;
import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.user.value.Gender;
import hu.webshop.engine.webshopbe.domain.user.value.Role;


public record UserResponse(
        UUID id,
        String email,
        String firstname,
        String lastname,
        Role role,
        Boolean verified,
        String phoneNumber,
        Gender gender,
        boolean subscribedToEmail,
        AddressResponse shippingAddress,
        AddressResponse billingAddress,
        List<CartItemResponse> cart,
        List<ProductResponse> saved,
        List<OrderResponse> orders
) {
}
