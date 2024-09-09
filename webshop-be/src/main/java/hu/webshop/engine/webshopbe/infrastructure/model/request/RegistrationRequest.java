package hu.webshop.engine.webshopbe.infrastructure.model.request;

import hu.webshop.engine.webshopbe.domain.user.value.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistrationRequest(
        @Email
        String email,
        @NotBlank
        String firstname,
        @NotBlank
        String lastname,
        @NotBlank
        String password,
        @NotBlank
        String phoneNumber,
        Gender gender,
        boolean subscribedToEmail,
        AddressRequest shippingAddress,
        AddressRequest billingAddress
) {
}
