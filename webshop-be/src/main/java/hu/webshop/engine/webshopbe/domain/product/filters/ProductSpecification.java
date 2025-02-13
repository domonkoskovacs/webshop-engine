package hu.webshop.engine.webshopbe.domain.product.filters;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import hu.webshop.engine.webshopbe.domain.product.entity.Brand;
import hu.webshop.engine.webshopbe.domain.product.entity.Category;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.entity.SubCategory;
import hu.webshop.engine.webshopbe.domain.product.value.ProductSpecificationArgs;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ProductSpecification {

    public static Specification<Product> getExportSpecification(ProductSpecificationArgs args, LocalDate from, LocalDate to) {
        return getSpecifications(args)
                .and(createTimeIsBetween(from, to));
    }

    private static Specification<Product> createTimeIsBetween(LocalDate from, LocalDate to) {
        return (products, cq, cb) -> {
            if (from == null && to == null) return cb.conjunction();
            else {
                Predicate creationTimeAfter = cb.greaterThanOrEqualTo(products.get("creationTime"), from);
                Predicate creationTimeBefore = cb.lessThanOrEqualTo(products.get("creationTime"), to);
                if (to == null) return creationTimeAfter;
                else if (from == null) return creationTimeBefore;
                else return cb.and(creationTimeAfter, creationTimeBefore);
            }
        };
    }

    public static Specification<Product> getSpecifications(ProductSpecificationArgs args) {
        return Specification.where(brand(args.brands()))
                .and(category(args.categories()))
                .and(subCategory(args.subCategories()))
                .and(type(args.types()))
                .and(maxPrice(args.maxPrice()))
                .and(minPrice(args.minPrice()))
                .and(maxDiscountPercentage(args.maxDiscountPercentage()))
                .and(minDiscountPercentage(args.minDiscountPercentage()))
                .and(itemNumber(args.itemNumber()))
                .and(outOfStock(args.showOutOfStock()));
    }

    private static Specification<Product> brand(List<String> brands) {
        return (products, cq, cb) -> {
            if (brands == null || brands.isEmpty()) return cb.conjunction();
            Join<Product, Brand> brandJoin = products.join("brand");
            return brandJoin.get("name").in(brands);
        };
    }

    private static Specification<Product> subCategory(List<String> subCategoryNames) {
        return (products, cq, cb) -> {
            if (subCategoryNames == null || subCategoryNames.isEmpty()) return cb.conjunction();
            Join<Product, SubCategory> subCategoryJoin = products.join("subCategory");
            return subCategoryJoin.get("name").in(subCategoryNames);
        };
    }

    private static Specification<Product> category(List<String> categoryNames) {
        return (products, cq, cb) -> {
            if (categoryNames == null || categoryNames.isEmpty()) {
                return cb.conjunction();
            }

            Join<Product, SubCategory> subCategoryJoin = products.join("subCategory");
            Join<SubCategory, Category> categoryJoin = subCategoryJoin.join("category");

            return categoryJoin.get("name").in(categoryNames);
        };
    }

    private static Specification<Product> type(List<String> types) {
        return (products, cq, cb) -> {
            if (types == null || types.isEmpty()) return cb.conjunction();
            return products.get("type").in(types);
        };
    }

    private static Specification<Product> maxPrice(Double price) {
        return (products, cq, cb) -> {
            if (price == null) return cb.conjunction();
            return cb.lessThanOrEqualTo(products.get("price"), price);
        };
    }

    private static Specification<Product> minPrice(Double price) {
        return (products, cq, cb) -> {
            if (price == null) return cb.conjunction();
            return cb.greaterThanOrEqualTo(products.get("price"), price);
        };
    }

    private static Specification<Product> maxDiscountPercentage(Double discountPercentage) {
        return (products, cq, cb) -> {
            if (discountPercentage == null) return cb.conjunction();
            return cb.lessThanOrEqualTo(products.get("discountPercentage"), discountPercentage);
        };
    }

    private static Specification<Product> minDiscountPercentage(Double discountPercentage) {
        return (products, cq, cb) -> {
            if (discountPercentage == null) return cb.conjunction();
            return cb.greaterThanOrEqualTo(products.get("discountPercentage"), discountPercentage);
        };
    }

    private static Specification<Product> itemNumber(String itemNumber) {
        return (products, cq, cb) -> {
            if (itemNumber == null) return cb.conjunction();
            return cb.like(products.get("itemNumber"), "%" + itemNumber + "%");
        };
    }

    private static Specification<Product> outOfStock(Boolean showOutOfStock) {
        return (products, cq, cb) -> {
            if (showOutOfStock == null || showOutOfStock) return cb.conjunction();
            return cb.greaterThan(products.get("count"), 0);
        };
    }
}
