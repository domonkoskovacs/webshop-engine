package hu.webshop.engine.webshopbe.domain.product.model;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode(callSuper = true)
public class ProductPage<T> extends PageImpl<T> {
    private final Double minPrice;
    private final Double maxPrice;
    private final Double minDiscount;
    private final Double maxDiscount;

    public ProductPage(List<T> content, Pageable pageable, long total, Double minPrice, Double maxPrice, Double minDiscount, Double maxDiscount) {
        super(content, pageable, total);
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.minDiscount = minDiscount;
        this.maxDiscount = maxDiscount;
    }

    @Override
    @NonNull
    public <U> ProductPage<U> map(@NonNull Function<? super T, ? extends U> converter) {
        List<U> convertedContent = getContent().stream()
                .map(converter)
                .collect(Collectors.toList());
        return new ProductPage<>(convertedContent, getPageable(), getTotalElements(), minPrice, maxPrice, minDiscount, maxDiscount);
    }

}
