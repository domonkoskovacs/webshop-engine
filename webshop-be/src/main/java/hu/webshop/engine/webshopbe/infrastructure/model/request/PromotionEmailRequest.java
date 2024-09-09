package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.time.DayOfWeek;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record PromotionEmailRequest(
        @NotBlank String name,
        @NotBlank String text,
        @NotBlank String subject,
        @NotBlank String imageUrl,
        @NotNull @NotEmpty List<@NotNull DayOfWeek> dayOfWeek,
        int hour,
        int minute
) {
}
