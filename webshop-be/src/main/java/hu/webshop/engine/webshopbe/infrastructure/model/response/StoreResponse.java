package hu.webshop.engine.webshopbe.infrastructure.model.response;

import jakarta.validation.constraints.NotNull;

public record StoreResponse(
        @NotNull Double minOrderPrice,
        @NotNull Double shippingPrice,
        @NotNull Integer returnPeriod,
        String theme,
        String primaryColor,
        String secondaryColor,
        Boolean deleteOutOfStockProducts,
        Boolean deleteUnusedPictures,
        Boolean enableBuiltInMarketingEmails
) {
}
