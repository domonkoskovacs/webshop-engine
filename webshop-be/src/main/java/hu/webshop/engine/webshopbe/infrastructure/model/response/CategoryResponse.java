package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.List;
import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        List<SubCategoryResponse> subCategories
) {
}
