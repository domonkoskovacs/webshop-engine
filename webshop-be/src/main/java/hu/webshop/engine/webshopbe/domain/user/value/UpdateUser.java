package hu.webshop.engine.webshopbe.domain.user.value;


import hu.webshop.engine.webshopbe.domain.user.entity.Address;

public record UpdateUser(
        String email,
        String firstname,
        String lastname,
        String phoneNumber,
        Gender gender,
        Address shippingAddress,
        Address billingAddress
) {
}
