import {ProductServiceApiExportRequest, ProductServiceApiGetAllRequest} from "../shared/api";
import {Gender} from "../types/gender";

export const getProductGender = (itemGender: string, gender: Gender): string => {
    if (!itemGender) return "";
    return itemGender.toLowerCase() === "unisex"
        ? gender.toLowerCase()
        : itemGender.toLowerCase();
};

export const mapFiltersToExportRequest = (
    filters: ProductServiceApiGetAllRequest
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
