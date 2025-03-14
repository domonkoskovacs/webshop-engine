package hu.webshop.engine.webshopbe.domain.order.model;

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
public class OrderPage<T> extends PageImpl<T> {
    private final Double minPrice;
    private final Double maxPrice;

    public OrderPage(List<T> content, Pageable pageable, long total, Double minPrice, Double maxPrice) {
        super(content, pageable, total);
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    @Override
    @NonNull
    public <U> OrderPage<U> map(@NonNull Function<? super T, ? extends U> converter) {
        List<U> convertedContent = getContent().stream()
                .map(converter)
                .collect(Collectors.toList());
        return new OrderPage<>(convertedContent, getPageable(), getTotalElements(), minPrice, maxPrice);
    }
}
