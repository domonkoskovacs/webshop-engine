package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.value.ProductUpdate;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ProductRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ProductUpdateRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductResponse;

@Mapper(uses = {CategoryMapper.class, BrandMapper.class})
public interface ProductMapper {

    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "brand", ignore = true)
    Product fromRequest(ProductRequest request);

    @Mapping(target = "imageUrls", source = "images", qualifiedByName = "mapImagesToUrls")
    @Mapping(target = "category", source = "subCategory.category")
    ProductResponse toResponse(Product entity);

    @Named("mapImagesToUrls")
    static List<String> mapImagesToUrls(List<ImageMetadata> images) {
        if (images == null || images.isEmpty()) return List.of();
        return images.stream()
                .map(ImageMetadata::getUrl)
                .toList();
    }

    List<ProductResponse> toResponseList(List<Product> entities);

    ProductUpdate fromRequest(ProductUpdateRequest productUpdateRequest);
}
