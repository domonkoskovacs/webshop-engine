package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotNull;

public record StoreRequest(
        @NotNull Double minOrderPrice,
        @NotNull Double shippingPrice,
        @NotNull Integer returnPeriod,
        String theme,
        String primaryColor,
        String secondaryColor,
        @NotNull Boolean deleteOutOfStockProducts,
        @NotNull Boolean deleteUnusedPictures,
        @NotNull Boolean enableBuiltInMarketingEmails
) {
}
