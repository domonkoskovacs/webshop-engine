import {ProductServiceApiExportRequest, ProductServiceApiGetAll1Request} from "../shared/api";
import {Gender} from "../types/gender";

export const getProductGender = (itemGender: string, gender: Gender): string => {
    if (!itemGender) return "";
    return itemGender.toLowerCase() === "unisex"
        ? gender.toLowerCase()
        : itemGender.toLowerCase();
};

export const mapFiltersToExportRequest = (
    filters: ProductServiceApiGetAll1Request
): ProductServiceApiExportRequest => {
    return {
        from: undefined,
        to: undefined,
        brands: filters.brands,
        categories: filters.categories,
        subCategories: filters.subCategories,
        genders: filters.genders as ProductServiceApiExportRequest["genders"],
        maxPrice: filters.maxPrice,
        minPrice: filters.minPrice,
        maxDiscountPercentage: filters.maxDiscountPercentage,
        minDiscountPercentage: filters.minDiscountPercentage,
        itemNumber: filters.itemNumber,
        showOutOfStock: filters.showOutOfStock,
    };
};

export const SORT_OPTIONS = [
    { label: "Price: Low to High", value: "ASC_PRICE" },
    { label: "Price: High to Low", value: "DESC_PRICE" },
    { label: "Discount: Low to High", value: "ASC_DISCOUNT" },
    { label: "Discount: High to Low", value: "DESC_DISCOUNT" },
];
