package hu.webshop.engine.webshopbe.domain.product;


import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getExportSpecification;
import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getSpecifications;
import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getSpecificationsWithoutDiscount;
import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getSpecificationsWithoutPrice;
import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.valueOfNullable;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.image.ImageService;
import hu.webshop.engine.webshopbe.domain.product.entity.Brand;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.entity.SubCategory;
import hu.webshop.engine.webshopbe.domain.product.mapper.ProductUpdateMapper;
import hu.webshop.engine.webshopbe.domain.product.model.ProductCsv;
import hu.webshop.engine.webshopbe.domain.product.model.ProductPage;
import hu.webshop.engine.webshopbe.domain.product.repository.ProductRepository;
import hu.webshop.engine.webshopbe.domain.product.value.Discount;
import hu.webshop.engine.webshopbe.domain.product.value.ProductSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.product.value.ProductUpdate;
import hu.webshop.engine.webshopbe.domain.product.value.StockChange;
import hu.webshop.engine.webshopbe.domain.util.CSVReader;
import hu.webshop.engine.webshopbe.domain.util.CSVWriter;
import hu.webshop.engine.webshopbe.domain.util.Constants;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductUpdateMapper productUpdateMapper;
    private final BrandService brandService;
    private final CategoryService categoryService;
    private final ImageService imageService;

    public List<Product> getAll() {
        log.info("getAll");
        return productRepository.findAll();
    }

    public List<Product> getAll(List<UUID> productIds) {
        log.info("getAll > productIds: [{}]", productIds);
        return productRepository.findAllById(productIds);
    }

    public ProductPage<Product> getAll(
            ProductSpecificationArgs args,
            PageRequest pageRequest
    ) {
        log.info("getAll > args: [{}], pageRequest: [{}]", args, pageRequest);
        Specification<Product> spec = getSpecifications(args);
        Page<Product> productsPage = productRepository.findAll(spec, pageRequest);
        List<Product> productsWithoutPriceFilter = productRepository.findAll(getSpecificationsWithoutPrice(args));
        List<Product> productsWithoutDiscountFilter = productRepository.findAll(getSpecificationsWithoutDiscount(args));
        Double minPrice = productsWithoutPriceFilter.stream().map(Product::getPrice).min(Double::compareTo).orElse(0d);
        Double maxPrice = productsWithoutPriceFilter.stream().map(Product::getPrice).max(Double::compareTo).orElse(0d);
        Double minDiscount = productsWithoutDiscountFilter.stream().map(Product::getDiscountPercentage).min(Double::compareTo).orElse(0d);
        Double maxDiscount = productsWithoutDiscountFilter.stream().map(Product::getDiscountPercentage).max(Double::compareTo).orElse(0d);
        return new ProductPage<>(productsPage.getContent(), pageRequest, productsPage.getTotalElements(), minPrice, maxPrice, minDiscount, maxDiscount);
    }

    public void delete(List<UUID> ids) {
        log.info("delete > ids: [{}]", ids);
        List<Product> products = productRepository.findAllById(ids);
        products.stream()
                .map(Product::getImageUrls)
                .filter(imageUrls -> imageUrls != null && !imageUrls.isEmpty())
                .forEach(imageService::deleteImagesFromFolder);
        productRepository.deleteAllById(ids);
    }

    public Product create(Product product, UUID subCategoryId, String brandName, List<MultipartFile> images) {
        log.info("create > product: [{}], images: [{}]", product, images);
        return setProductValues(subCategoryId, brandName, images, product);
    }

    @NotNull
    private Product setProductValues(UUID subCategoryId, String brandName, List<MultipartFile> images, Product product) {
        setImageUrls(product, images);
        product.setSubCategory(categoryService.getSubCategoryById(subCategoryId));
        product.setBrand(brandService.getByName(brandName));
        return productRepository.save(product);
    }

    private void setImageUrls(Product product, List<MultipartFile> images) {
        if (images != null) {
            List<String> ids = images.stream()
                    .map(imageService::saveImageToFolder)
                    .map(imageService::getImageUrl)
                    .toList();
            String imageIds = String.join(Constants.IMAGE_URL_SEPARATOR, ids);
            product.setImageUrls(imageIds);
        }
    }

    public Product update(UUID uuid, ProductUpdate productUpdate) {
        log.info("update > uuid: [{}], productUpdate: [{}]", uuid, productUpdate);
        Product old = getById(uuid);
        Product updatedProduct = productUpdateMapper.update(old, productUpdate);

        List<String> preservedImages = productUpdate.existingImageIds() != null
                ? productUpdate.existingImageIds()
                : new ArrayList<>();

        List<String> newImageUrls = new ArrayList<>();
        if (productUpdate.newImages() != null) {
            newImageUrls.addAll(productUpdate.newImages().stream()
                    .map(imageService::saveImageToFolder)
                    .map(imageService::getImageUrl)
                    .toList());
        }

        List<String> mergedImages = Stream.concat(preservedImages.stream(), newImageUrls.stream()).toList();
        if (old.getImageUrls() != null && !old.getImageUrls().isEmpty()) {
            Arrays.stream(old.getImageUrls().split(Constants.IMAGE_URL_SEPARATOR))
                    .filter(url -> !mergedImages.contains(url))
                    .forEach(imageService::deleteImagesFromFolder);
        }

        updatedProduct.setImageUrls(String.join(Constants.IMAGE_URL_SEPARATOR, mergedImages));
        updatedProduct.setSubCategory(categoryService.getSubCategoryById(productUpdate.subCategoryId()));
        updatedProduct.setBrand(brandService.getByName(productUpdate.brand()));

        return productRepository.save(updatedProduct);
    }

    public Product getById(UUID uuid) {
        log.info("getById > uuid: [{}]", uuid);
        return productRepository.findById(uuid).orElseThrow(this::entityNotFoundException);
    }

    private EntityNotFoundException entityNotFoundException() {
        return new EntityNotFoundException("Product was not found");
    }

    public void setDiscounts(List<Discount> discounts) {
        log.info("setDiscounts > discounts: [{}]", discounts);
        Map<UUID, Discount> discountMap = discounts.stream()
                .collect(Collectors.toMap(Discount::id, discount -> discount));

        List<Product> products = getAll(discounts.stream().map(Discount::id).toList());
        products.forEach(product -> product.setDiscountPercentage(discountMap.get(product.getId()).discount()));

        productRepository.saveAll(products);
    }

    public void updateStock(UUID id, Integer difference, StockChange stockChange) {
        log.info("updateStock > id: [{}], difference: [{}]", id, difference);
        Product byId = getById(id);
        if (StockChange.INCREMENT.equals(stockChange)) {
            byId.setCount(byId.getCount() + difference);
        } else {
            byId.setCount(byId.getCount() - difference);
        }
        productRepository.save(byId);
    }

    public void importAndSave(String csv) {
        List<ProductCsv> parsedProducts = new CSVReader<>(ProductCsv.class, new String[]{"itemNumber", "brand", "name", "description", "subCategoryName", "gender", "count", "price", "discountPercentage", "imagesUrls"})
                .base64()
                .csv(csv)
                .registerValidator("brand", brandService::existsByName)
                .registerValidator("subCategoryName", categoryService::subCategoryExistsByName)
                .validate()
                .parse();
        List<Product> products = parsedProducts.stream()
                .map(productCsv -> {
                    Product fromCsv = productUpdateMapper.fromCsv(productCsv);
                    fromCsv.setBrand(brandService.getByName(productCsv.getBrand()));
                    fromCsv.setSubCategory(categoryService.getSubCategoryByName(productCsv.getSubCategoryName()));
                    return fromCsv;
                })
                .toList();
        productRepository.saveAll(products);
    }

    public String export(LocalDate from, LocalDate to, ProductSpecificationArgs args) {
        log.info("export > from: [{}], to: [{}], args: [{}]", from, to, args);
        Specification<Product> spec = getExportSpecification(args, from, to);
        List<Product> exportData = productRepository.findAll(spec);
        String[] header = {"Brand", "Name", "Description", "SubCategory", "Gender", "Count", "Price", "DiscountPercentage", "ImageUrls", "ItemNumber"};
        List<Function<Product, ?>> columnExtractors = List.of(
                product -> valueOfNullable(product.getBrand(), Brand::getName),
                Product::getName,
                Product::getDescription,
                product -> valueOfNullable(product.getSubCategory(), SubCategory::getName),
                Product::getGender,
                Product::getCount,
                Product::getPrice,
                Product::getDiscountPercentage,
                Product::getImageUrls,
                Product::getItemNumber
        );
        return new CSVWriter<>(
                exportData,
                header,
                columnExtractors
        ).base64().asString();
    }

    public void deleteAllByStockAndDate(int stock, OffsetDateTime dateTime) {
        log.info("deleteAllByStockAndDate > stock: [{}], dateTime: [{}]", stock, dateTime);
        List<Product> products = productRepository.findAllByCountIsLessThanEqualAndCreationTimeLessThan(stock, dateTime);
        products.stream()
                .map(Product::getImageUrls)
                .filter(imageUrls -> imageUrls != null && !imageUrls.isEmpty())
                .forEach(imageService::deleteImagesFromFolder);
        productRepository.deleteAll(products);
    }
}
