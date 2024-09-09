package hu.webshop.engine.webshopbe.domain.product.value;

import java.util.List;

public record ProductSpecificationArgs(List<String> brands,
                                       List<String> categories,
                                       List<String> subCategories,
                                       List<String> types,
                                       Double maxPrice,
                                       Double minPrice,
                                       Double maxDiscountPercentage,
                                       Double minDiscountPercentage,
                                       boolean showOutOfStock) {
}
