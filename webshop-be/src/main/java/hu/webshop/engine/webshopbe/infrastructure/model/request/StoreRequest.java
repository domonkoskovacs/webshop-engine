package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotNull;

public record StoreRequest(
        @NotNull Double minOrderPrice,
        String theme,
        String primaryColor,
        String secondaryColor,
        Integer maxArticle,
        @NotNull Boolean deleteOutOfStockProducts,
        @NotNull Boolean deleteUnusedPictures,
        @NotNull Boolean enableBuiltInMarketingEmails
) {
}
