import { useState } from "react";
import { ProductServiceApiGetAllRequest } from "../../shared/api";

export const useProductFilters = () => {
    const [filters, setFilters] = useState<ProductServiceApiGetAllRequest>({
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
    });

    const updateFilters = (newFilters: Partial<ProductServiceApiGetAllRequest>) =>
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));

    const resetFilters = () => setFilters({ page: 1, size: 10 });

    const nextPage = (totalPages: number) =>
        setFilters((prev) => ({
            ...prev,
            page: prev.page && prev.page < totalPages ? prev.page + 1 : prev.page,
        }));

    const prevPage = () =>
        setFilters((prev) => ({
            ...prev,
            page: prev.page && prev.page > 1 ? prev.page - 1 : prev.page,
        }));

    const setPage = (page: number, totalPages: number) =>
        setFilters((prev) => ({
            ...prev,
            page: page >= 1 && page <= totalPages ? page : prev.page,
        }));

    return {
        filters,
        updateFilters,
        resetFilters,
        nextPage,
        prevPage,
        setPage,
    };
};
