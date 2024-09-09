package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.UUID;

public record AddressResponse(
        UUID id,
        String country,

        Integer zipCode,

        String city,

        String street,

        Integer streetNumber,

        String floorNumber
) {
}
