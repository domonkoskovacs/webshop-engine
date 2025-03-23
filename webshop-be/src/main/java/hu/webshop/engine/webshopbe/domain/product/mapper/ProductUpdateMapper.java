package hu.webshop.engine.webshopbe.domain.product.mapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.model.ProductCsv;
import hu.webshop.engine.webshopbe.domain.product.value.ProductUpdate;
import hu.webshop.engine.webshopbe.domain.util.Constants;


@Mapper
public interface ProductUpdateMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "creationTime", ignore = true)
    @Mapping(target = "lastModifiedTime", ignore = true)
    Product update(@MappingTarget Product updatable, ProductUpdate productUpdate);

    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "imageUrls", source = "imageUrls", qualifiedByName = "toImageUrlList")
    Product fromCsv(ProductCsv csv);

    @Named("toImageUrlList")
    default List<String> toImageUrlList(String imageUrls) {
        if (imageUrls == null || imageUrls.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(imageUrls.split(Constants.IMAGE_URL_SEPARATOR))
                .map(String::trim)
                .toList();
    }
}
