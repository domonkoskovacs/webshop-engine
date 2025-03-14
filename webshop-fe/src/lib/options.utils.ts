import {BrandResponse, CategoryResponse} from "../shared/api";

export const formatLabel = (value: string): string =>
    value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

export const mapEnumToOptions = <T extends Record<string, string>>(enumObj: T) =>
    Object.values(enumObj).map(value => ({
        label: formatLabel(value),
        value
    }));

export const mapCategoryNamesToOptions = (categories: CategoryResponse[]) => {
    return categories.map((category) => ({
        label: category.name!,
        value: category.name!
    })) || []
};

export const mapSubCategoryNamesToOptions = (categories: CategoryResponse[]) => {
    return categories.flatMap(category =>
        category.subCategories?.map(subCategory => ({
            label: subCategory.name!,
            value: subCategory.name!
        })) || []
    );
};

export const mapSubCategoriesToOptions = (categories: CategoryResponse[]) => {
    return categories.flatMap(category =>
        category.subCategories?.map(subCategory => ({
            label: subCategory.name!,
            value: subCategory.id!
        })) || []
    );
};

export const mapBrandsToOptions = (brands: BrandResponse[]) => {
    return brands.map(brand => ({
        label: brand.name!,
        value: brand.name!
    }));
};

