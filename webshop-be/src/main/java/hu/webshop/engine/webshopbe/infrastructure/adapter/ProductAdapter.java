package hu.webshop.engine.webshopbe.infrastructure.adapter;

import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSorting.sort;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.product.BrandService;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.model.ProductPage;
import hu.webshop.engine.webshopbe.domain.product.value.ProductSortType;
import hu.webshop.engine.webshopbe.domain.product.value.ProductSpecificationArgs;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.BrandMapper;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.ProductMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CsvRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.DeleteProductRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.DiscountRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ProductRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ProductUpdateRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.BrandResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CsvResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAdapter {

    private final ProductService productService;
    private final BrandService brandService;
    private final ProductMapper productMapper;
    private final BrandMapper brandMapper;

    public ProductResponse create(ProductRequest productRequest) {
        log.info("create > productRequest: [{}]", productRequest);
        return productMapper.toResponse(productService.create(productMapper.fromRequest(productRequest), productRequest.subCategoryId(), productRequest.brand(), productRequest.images()));
    }

    public ProductPage<ProductResponse> getAll(
            ProductSpecificationArgs args,
            ProductSortType sortType,
            int page,
            int size
    ) {
        log.info("getAll");
        PageRequest pageRequest = sortType != null ? PageRequest.of(page, size, sort(sortType)) : PageRequest.of(page, size);
        return productService.getAll(args, pageRequest).map(productMapper::toResponse);
    }

    public ProductResponse getById(UUID uuid) {
        log.info("getById > uuid: [{}]", uuid);
        return productMapper.toResponse(productService.getById(uuid));
    }

    public void delete(DeleteProductRequest deleteProductRequest) {
        log.info("delete > deleteProductRequest: [{}]", deleteProductRequest);
        productService.delete(deleteProductRequest.ids());
    }

    public ProductResponse update(UUID uuid, ProductUpdateRequest productUpdateRequest) {
        log.info("update > uuid: [{}], productUpdateRequest: [{}]", uuid, productUpdateRequest);
        return productMapper.toResponse(productService.update(uuid, productMapper.fromRequest(productUpdateRequest)));
    }

    public void setDiscount(DiscountRequest discountRequest) {
        log.info("setDiscount > discountRequest: [{}]", discountRequest);
        productService.setDiscounts(discountRequest.discounts());
    }

    public List<BrandResponse> getBrands() {
        return brandMapper.toResponseList(brandService.getAll());
    }

    public void importProducts(CsvRequest csvRequest) {
        log.info("importProducts > csvRequest: [{}]", csvRequest);
        productService.importAndSave(csvRequest.csv());
    }

    public CsvResponse export(LocalDate from, LocalDate to, ProductSpecificationArgs args) {
        log.info("export > from: [{}], to: [{}]", from, to);
        return new CsvResponse(productService.export(from, to, args));
    }
}
