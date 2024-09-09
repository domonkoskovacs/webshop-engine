package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import hu.webshop.engine.webshopbe.domain.product.entity.Category;
import hu.webshop.engine.webshopbe.domain.product.entity.SubCategory;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CategoryRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CategoryResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.SubCategoryResponse;

@Mapper
public interface CategoryMapper {

    @Mapping(target = "category", ignore = true)
    SubCategory fromRequestToSubCategory(CategoryRequest request);

    @Mapping(target = "subCategories", ignore = true)
    Category fromRequest(CategoryRequest request);

    SubCategoryResponse toResponse(SubCategory subCategory);

    List<SubCategoryResponse> toSubCategoryResponseList(List<SubCategory> subCategories);

    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);
}
