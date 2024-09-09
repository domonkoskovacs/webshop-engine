package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.product.entity.Brand;
import hu.webshop.engine.webshopbe.infrastructure.model.response.BrandResponse;

@Mapper
public interface BrandMapper {
    BrandResponse toResponse(Brand brand);

    List<BrandResponse> toResponseList(List<Brand> brands);
}
