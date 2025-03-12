package hu.webshop.engine.webshopbe.infrastructure.model.request;

import hu.webshop.engine.webshopbe.domain.user.value.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @Email
        String email,
        @NotBlank
        String firstname,
        @NotBlank
        String lastname,
        @NotBlank
        String phoneNumber,
        Gender gender,
        Boolean subscribedToEmail,
        AddressRequest shippingAddress,
        AddressRequest billingAddress
) {
}
