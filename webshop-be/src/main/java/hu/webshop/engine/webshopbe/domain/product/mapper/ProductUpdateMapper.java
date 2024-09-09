package hu.webshop.engine.webshopbe.domain.product.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.model.ProductCsv;


@Mapper
public interface ProductUpdateMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    Product update(@MappingTarget Product updatable, Product newProduct);

    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "brand", ignore = true)
    Product fromCsv(ProductCsv csv);
}
