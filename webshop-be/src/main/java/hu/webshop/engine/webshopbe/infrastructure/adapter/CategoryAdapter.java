package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.product.CategoryService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.CategoryMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CategoryRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CategoryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryAdapter {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> getALl() {
        log.info("getALl");
        return categoryMapper.toResponseList(categoryService.getAll());
    }

    public CategoryResponse create(CategoryRequest request) {
        log.info("create > request: [{}]", request);
        return categoryMapper.toResponse(categoryService.create(categoryMapper.fromRequest(request)));
    }

    public CategoryResponse addSubcategory(UUID id, CategoryRequest request) {
        log.info("addSubcategory");
        return categoryMapper.toResponse(categoryService.addSubCategory(id, categoryMapper.fromRequestToSubCategory(request)));
    }

    public CategoryResponse update(UUID id, CategoryRequest categoryRequest) {
        log.info("update > id: [{}], categoryRequest: [{}]", id, categoryRequest);
        return categoryMapper.toResponse(categoryService.updateCategory(id, categoryRequest.name()));
    }

    public void delete(UUID id) {
        log.info("delete > id: [{}]", id);
        categoryService.delete(id);
    }

    public void deleteSubcategory(UUID id) {
        log.info("deleteSubcategory > id: [{}]", id);
        categoryService.deleteSubCategory(id);
    }
}
