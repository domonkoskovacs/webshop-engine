import { useState } from "react";
import { ProductServiceApiGetAllRequest } from "../../shared/api";

const defaultFilters: ProductServiceApiGetAllRequest = {
    brands: [],
    categories: [],
    subCategories: [],
    genders: [],
    maxPrice: undefined,
    minPrice: undefined,
    maxDiscountPercentage: undefined,
    minDiscountPercentage: undefined,
    itemNumber: undefined,
    showOutOfStock: false,
    sortType: undefined,
    page: 1,
    size: 10,
};

export const useProductScrollFilters = () => {
    const [filters, setFilters] = useState<ProductServiceApiGetAllRequest>(defaultFilters);
    const [urlFiltersApplied, setUrlFiltersApplied] = useState(false);

    const updateFilters = (newFilters: Partial<ProductServiceApiGetAllRequest>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const resetFilters = () => setFilters(defaultFilters);

    return {
        filters,
        updateFilters,
        resetFilters,
        urlFiltersApplied,
        setUrlFiltersApplied,
    };
};
