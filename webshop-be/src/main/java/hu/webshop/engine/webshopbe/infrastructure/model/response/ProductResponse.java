package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.List;
import java.util.UUID;


public record ProductResponse(
        UUID id,
        BrandResponse brand,
        String name,
        String description,
        CategoryResponse category,
        SubCategoryResponse subCategory,
        String type,
        Integer count,
        Double price,
        Double discountPercentage,
        List<String> imageUrls,
        String itemNumber
) {
}
