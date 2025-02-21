package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.domain.product.model.ProductPage;
import hu.webshop.engine.webshopbe.domain.product.value.ProductSortType;
import hu.webshop.engine.webshopbe.domain.product.value.ProductSpecificationArgs;
import hu.webshop.engine.webshopbe.infrastructure.adapter.ProductAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CsvRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.DeleteProductRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.DiscountRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ProductRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.BrandResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CsvResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
@Tag(
        name = "Product service",
        description = "REST endpoints for product service"
)
public class ProductController {

    private final ProductAdapter productAdapter;

    @Operation(
            tags = {"Product service"},
            summary = "Create product",
            description = "Create a new product"
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
    @Admin
    public ResponseEntity<ProductResponse> create(@ModelAttribute ProductRequest productRequest) {
        log.info("create > productRequest: [{}]", productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(productAdapter.create(productRequest));
    }

    @Operation(
            tags = {"Product service"},
            summary = "Get all products",
            description = "Get all existing products"
    )
    @GetMapping(produces = "application/json")
    public ResponseEntity<ProductPage<ProductResponse>> getAll(
            @RequestParam(required = false) List<String> brands,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> subCategories,
            @RequestParam(required = false) List<String> types,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxDiscountPercentage,
            @RequestParam(required = false) Double minDiscountPercentage,
            @RequestParam(required = false) String itemNumber,
            @RequestParam(defaultValue = "false") boolean showOutOfStock,
            @RequestParam(required = false) ProductSortType sortType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("getAll");
        return ResponseEntity.ok(productAdapter.getAll(new ProductSpecificationArgs(brands, categories, subCategories, types, maxPrice,
                minPrice, maxDiscountPercentage, minDiscountPercentage, itemNumber, showOutOfStock), sortType, page, size));
    }

    @Operation(
            tags = {"Product service"},
            summary = "Get a products by id",
            description = "Get a products by id"
    )
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<ProductResponse> getById(@PathVariable UUID id) {
        log.info("getById > id: [{}]", id);
        return ResponseEntity.ok(productAdapter.getById(id));
    }

    @Operation(
            tags = {"Product service"},
            summary = "Get brands",
            description = "Public endpoint, return existing brands"
    )
    @GetMapping(value = "/brand", produces = "application/json")
    public ResponseEntity<List<BrandResponse>> getBrands() {
        log.info("getBrands");
        return ResponseEntity.ok(productAdapter.getBrands());
    }

    @Operation(
            tags = {"Product service"},
            summary = "Delete products with id list",
            description = "Delete products with id list"
    )
    @DeleteMapping(consumes = "application/json")
    @Admin
    public ResponseEntity<Void> delete(@RequestBody DeleteProductRequest deleteProductRequest) {
        log.info("delete > deleteProductRequest: [{}]", deleteProductRequest);
        productAdapter.delete(deleteProductRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(
            tags = {"Product service"},
            summary = "Update a products by id",
            description = "Update a products by id"
    )
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
    @Admin
    public ResponseEntity<ProductResponse> update(@PathVariable UUID id, @ModelAttribute ProductRequest productRequest) {
        log.info("update > id: [{}], productRequest: [{}]", id, productRequest);
        return ResponseEntity.ok(productAdapter.update(id, productRequest));
    }

    @Operation(
            tags = {"Product service"},
            summary = "Update products discount by id",
            description = "Update products discount by id"
    )
    @PostMapping(value = "/discount", consumes = "application/json", produces = "application/json")
    @Admin
    public ResponseEntity<Void> setDiscounts(@RequestBody DiscountRequest discountRequest) {
        log.info("setDiscount > discountRequest: [{}]", discountRequest);
        productAdapter.setDiscount(discountRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(
            tags = {"Product service"},
            summary = "Import products from a csv",
            description = "Import products from a base64 encoded csv"
    )
    @PostMapping(value = "/import", consumes = "application/json", produces = "application/json")
    @Admin
    public ResponseEntity<Void> importProducts(@RequestBody CsvRequest csvRequest) {
        log.info("importProducts > csvRequest: [{}]", csvRequest);
        productAdapter.importProducts(csvRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(
            tags = {"Product service"},
            summary = "Export products to a csv",
            description = "Export products to a base64 encoded csv"
    )
    @GetMapping(value = "/export", produces = "application/json")
    @Admin
    public ResponseEntity<CsvResponse> export(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false) List<String> brands,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> subCategories,
            @RequestParam(required = false) List<String> types,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxDiscountPercentage,
            @RequestParam(required = false) Double minDiscountPercentage,
            @RequestParam(required = false) String itemNumber,
            @RequestParam(defaultValue = "false") boolean showOutOfStock
    ) {
        log.info("export > from: [{}], to: [{}]", from, to);
        return ResponseEntity.ok().body(productAdapter.export(from, to, new ProductSpecificationArgs(brands, categories, subCategories, types, maxPrice,
                minPrice, maxDiscountPercentage, minDiscountPercentage, itemNumber, showOutOfStock)));
    }
}
