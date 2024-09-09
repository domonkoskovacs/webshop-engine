package hu.webshop.engine.webshopbe.domain.product.filters;

import org.springframework.data.domain.Sort;

import hu.webshop.engine.webshopbe.domain.product.value.ProductSortType;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ProductSorting {

    public static Sort sort(ProductSortType sortType) {
        return switch (sortType) {
            case ASC_PRICE -> Sort.by(Sort.Direction.ASC, "price");
            case DESC_PRICE -> Sort.by(Sort.Direction.DESC, "price");
            case ASC_DISCOUNT -> Sort.by(Sort.Direction.ASC, "discountPercentage");
            case DESC_DISCOUNT -> Sort.by(Sort.Direction.DESC, "discountPercentage");
        };
    }
}
