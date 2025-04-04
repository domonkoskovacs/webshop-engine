package hu.webshop.engine.webshopbe.domain.product;


import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getExportSpecification;
import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getSpecifications;
import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getSpecificationsWithoutDiscount;
import static hu.webshop.engine.webshopbe.domain.product.filters.ProductSpecification.getSpecificationsWithoutPrice;
import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.valueOfNullable;

import java.net.URI;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.image.ImageService;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
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
import hu.webshop.engine.webshopbe.domain.product.value.StockChangeType;
import hu.webshop.engine.webshopbe.domain.util.CSVReader;
import hu.webshop.engine.webshopbe.domain.util.CSVWriter;
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
        productRepository.deleteAllById(ids);
    }

    public Product create(Product product, UUID subCategoryId, String brandName, List<MultipartFile> images) {
        log.info("create > product: [{}], images: [{}]", product, images);
        return setProductValues(subCategoryId, brandName, images, product);
    }

    @NotNull
    private Product setProductValues(UUID subCategoryId, String brandName, List<MultipartFile> images, Product product) {
        setImages(product, images);
        product.setSubCategory(categoryService.getSubCategoryById(subCategoryId));
        product.setBrand(brandService.getByName(brandName));
        return productRepository.save(product);
    }

    private void setImages(Product product, List<MultipartFile> images) {
        if (images != null) {
            List<ImageMetadata> imageMetadataList = images.stream()
                    .map(imageService::save)
                    .toList();
            product.setImages(imageMetadataList);
        }
    }

    public Product update(UUID uuid, ProductUpdate productUpdate) {
        log.info("update > uuid: [{}], productUpdate: [{}]", uuid, productUpdate);
        Product old = getById(uuid);
        Product updatedProduct = productUpdateMapper.update(old, productUpdate);

        List<UUID> preservedImageIds = productUpdate.existingImageIds() != null
                ? productUpdate.existingImageIds().stream()
                .map(this::extractIdFromUrl)
                .filter(Objects::nonNull)
                .toList()
                : List.of();

        List<ImageMetadata> newImages = productUpdate.newImages() != null
                ? productUpdate.newImages().stream().map(imageService::save).toList()
                : List.of();

        List<ImageMetadata> images = old.getImages();
        images.clear();
        images.addAll(
                old.getImages().stream()
                        .filter(img -> preservedImageIds.contains(img.getId()))
                        .toList()
        );
        images.addAll(newImages);
        updatedProduct.setSubCategory(categoryService.getSubCategoryById(productUpdate.subCategoryId()));
        updatedProduct.setBrand(brandService.getByName(productUpdate.brand()));

        return productRepository.save(updatedProduct);
    }

    private UUID extractIdFromUrl(String url) {
        try {
            URI uri = new URI(url);
            String path = uri.getPath();
            String uuidPart = path.substring(path.lastIndexOf('/') + 1);
            return UUID.fromString(uuidPart);
        } catch (Exception e) {
            log.warn("Invalid image URL: {}", url, e);
            return null;
        }
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

    public void updateStock(List<StockChange> stockChanges, StockChangeType type) {
        log.info("updateStock > stockChanges: [{}], type: [{}]", stockChanges, type);
        stockChanges.forEach(change -> updateStock(change, type));
    }

    private void updateStock(StockChange stockChange, StockChangeType stockChangeType) {
        Product byId = getById(stockChange.productId());
        if (StockChangeType.INCREMENT.equals(stockChangeType)) {
            byId.setCount(byId.getCount() + stockChange.count());
        } else {
            byId.setCount(byId.getCount() - stockChange.count());
        }
        productRepository.save(byId);
    }

    public void importAndSave(String csv) {
        final Pattern doublePattern = Pattern.compile("\\d+(\\.\\d{1,2})?");
        final Pattern integerPattern = Pattern.compile("\\d+");

        List<ProductCsv> parsedProducts = new CSVReader<>(ProductCsv.class, new String[]{"itemNumber", "brand", "name", "description", "subCategoryName", "gender", "count", "price", "discountPercentage", "imageUrls"})
                .base64()
                .csv(csv)
                .registerValidator("brand", brandService::existsByName)
                .registerValidator("subCategoryName", categoryService::subCategoryExistsByName)
                .registerValidator("price",
                        s -> doublePattern.matcher(s).matches(),
                        s -> {
                            double price = Double.parseDouble(s);
                            return price > 0;
                        })
                .registerValidator("count",
                        s -> integerPattern.matcher(s).matches(),
                        s -> {
                            int count = Integer.parseInt(s);
                            return count >= 0;
                        })
                .registerValidator("discountPercentage",
                        s -> doublePattern.matcher(s).matches(),
                        s -> {
                            double discount = Double.parseDouble(s);
                            return discount >= 0 && discount <= 100;
                        })
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
                Product::getExportImageUrls,
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
        productRepository.deleteAll(products);
    }
}
