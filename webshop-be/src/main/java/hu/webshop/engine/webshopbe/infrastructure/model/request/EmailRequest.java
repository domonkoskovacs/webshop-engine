package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.Email;

public record EmailRequest(
        @Email String email
) {
}
