package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotBlank;

public record NewPasswordRequest(@NotBlank String password) {
}
