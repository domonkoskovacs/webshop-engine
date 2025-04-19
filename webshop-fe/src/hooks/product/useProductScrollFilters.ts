import { useState } from "react";
import { ProductServiceApiGetAll1Request } from "../../shared/api";

const defaultFilters: ProductServiceApiGetAll1Request = {
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
    const [filters, setFilters] = useState<ProductServiceApiGetAll1Request>(defaultFilters);
    const [urlFiltersApplied, setUrlFiltersApplied] = useState(false);

    const updateFilters = (newFilters: Partial<ProductServiceApiGetAll1Request>) => {
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
