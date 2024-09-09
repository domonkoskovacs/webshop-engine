package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

public record PromotionEmailResponse(
        UUID id,
        String name,
        String text,
        String subject,
        String imageUrl,
        List<DayOfWeek> dayOfWeek,
        int hour,
        int minute
) {
}
