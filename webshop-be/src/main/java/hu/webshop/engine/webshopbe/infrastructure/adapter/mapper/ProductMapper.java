package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.value.Discount;
import hu.webshop.engine.webshopbe.infrastructure.model.request.DiscountRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ProductRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductResponse;

@Mapper(uses = {CategoryMapper.class, BrandMapper.class})
public interface ProductMapper {

    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "brand", ignore = true)
    Product fromRequest(ProductRequest request);

    @Mapping(target = "category", source = "subCategory.category")
    @Mapping(target = "imageUrls", source = "imageUrls", qualifiedByName = "toImageUrls")
    ProductResponse toResponse(Product entity);

    List<ProductResponse> toResponseList(List<Product> entities);

    Discount fromRequest(DiscountRequest request);

    @Named("toImageUrls")
    default List<String> toImageUrls(String imageIds) {
        if (imageIds != null) return Arrays.stream(imageIds.split(";")).toList();
        return Collections.emptyList();
    }
}
