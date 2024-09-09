package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotBlank;

public record PaymentTokenRequest(
        @NotBlank String token
) {
}
