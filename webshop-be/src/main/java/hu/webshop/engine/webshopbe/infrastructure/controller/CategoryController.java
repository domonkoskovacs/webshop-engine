package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.CategoryAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CategoryRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CategoryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(
        name = "Category service",
        description = "REST endpoints for category service"
)
public class CategoryController {

    private final CategoryAdapter categoryAdapter;

    @Operation(
            tags = {"Category service"},
            summary = "Get all category",
            description = "Public endpoint returns all categories"
    )
    @GetMapping(value = ApiPaths.Categories.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CategoryResponse>> getAll() {
        log.info("getAll");
        return ResponseEntity.ok(categoryAdapter.getALl());
    }

    @Operation(
            tags = {"Category service"},
            summary = "Create a category",
            description = "Admins can create a category"
    )
    @PostMapping(value = ApiPaths.Categories.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest request) {
        log.info("create > request: [{}]", request);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryAdapter.create(request));
    }

    @Operation(
            tags = {"Category service"},
            summary = "Add a subcategory to a category",
            description = "Admins can add a subcategory to a category"
    )
    @PostMapping(value = ApiPaths.Categories.CATEGORY_BY_ID_SUBCATEGORIES, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<CategoryResponse> addSubCategory(@PathVariable UUID id, @RequestBody CategoryRequest request) {
        log.info("addSubCategory > id: [{}], request: [{}]", id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryAdapter.addSubcategory(id, request));
    }

    @Operation(
            tags = {"Category service"},
            summary = "Update a category",
            description = "Admins can update a category"
    )
    @PutMapping(value = ApiPaths.Categories.BY_ID, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<CategoryResponse> update(@PathVariable UUID id, @RequestBody CategoryRequest request) {
        log.info("update > id: [{}], request: [{}]", id, request);
        return ResponseEntity.ok(categoryAdapter.update(id, request));
    }

    @Operation(
            tags = {"Category service"},
            summary = "Delete a category",
            description = "Admins can delete a category"
    )
    @DeleteMapping(ApiPaths.Categories.BY_ID)
    @Admin
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("delete > id: [{}]", id);
        categoryAdapter.delete(id);
        return ResponseEntity.ok().build();
    }

    @Operation(
            tags = {"Category service"},
            summary = "Delete a subcategory",
            description = "Admins can delete a subcategory"
    )
    @DeleteMapping(ApiPaths.Categories.SUBCATEGORY_BY_ID)
    @Admin
    public ResponseEntity<Void> deleteSubCategory(@PathVariable UUID id) {
        log.info("deleteSubCategory > id: [{}]", id);
        categoryAdapter.deleteSubcategory(id);
        return ResponseEntity.ok().build();
    }
}
