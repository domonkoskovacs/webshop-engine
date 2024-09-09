package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddressRequest(
        @NotBlank
        String country,
        @NotNull
        Integer zipCode,
        @NotBlank
        String city,
        @NotBlank
        String street,
        @NotNull
        Integer streetNumber,
        @NotBlank
        String floorNumber
) {
}
