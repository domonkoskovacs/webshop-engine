package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.Email;

public record ForgottenPasswordRequest(@Email String email) {
}
