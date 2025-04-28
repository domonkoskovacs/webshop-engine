package hu.webshop.engine.webshopbe.infrastructure.model.request;

import jakarta.validation.constraints.NotNull;

public record StoreRequest(
        @NotNull String name,
        @NotNull Double minOrderPrice,
        @NotNull Double shippingPrice,
        @NotNull Integer returnPeriod,
        @NotNull Integer unpaidOrderCancelHours,
        @NotNull Boolean deleteOutOfStockProducts,
        @NotNull Boolean enableBuiltInMarketingEmails
) {
}
