package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.product.value.Gender;


public record ProductResponse(
        UUID id,
        BrandResponse brand,
        String name,
        String description,
        CategoryResponse category,
        SubCategoryResponse subCategory,
        Gender gender,
        Integer count,
        Double price,
        Double discountPercentage,
        List<String> imageUrls,
        String itemNumber,
        OffsetDateTime creationTime
) {
}
