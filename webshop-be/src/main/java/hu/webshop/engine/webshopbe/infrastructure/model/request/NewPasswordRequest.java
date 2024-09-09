package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NewPasswordRequest(@NotNull UUID id, @NotBlank String password) {
}
