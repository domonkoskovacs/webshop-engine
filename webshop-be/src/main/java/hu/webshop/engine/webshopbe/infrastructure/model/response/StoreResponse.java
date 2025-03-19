package hu.webshop.engine.webshopbe.infrastructure.model.response;

import jakarta.validation.constraints.NotNull;

public record StoreResponse(
        @NotNull String name,
        @NotNull Double minOrderPrice,
        @NotNull Double shippingPrice,
        @NotNull Integer returnPeriod,
        @NotNull Integer unpaidOrderCancelHours,
        String theme,
        String primaryColor,
        String secondaryColor,
        @NotNull Boolean deleteOutOfStockProducts,
        @NotNull Boolean deleteUnusedPictures,
        @NotNull Boolean enableBuiltInMarketingEmails
) {
}
