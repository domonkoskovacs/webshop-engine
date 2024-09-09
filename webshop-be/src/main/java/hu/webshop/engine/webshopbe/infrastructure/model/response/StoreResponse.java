package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.List;

public record StoreResponse(
        Double minOrderPrice,
        String theme,
        String primaryColor,
        String secondaryColor,
        Integer maxArticle,
        Boolean deleteOutOfStockProducts,
        Boolean deleteUnusedPictures,
        Boolean enableBuiltInMarketingEmails,
        List<SocialIconResponse> socialIcons
) {
}
