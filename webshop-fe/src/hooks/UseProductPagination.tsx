import { useState, useEffect, useCallback } from "react";
import {BrandResponse, ProductResponse, ProductServiceApiGetAllRequest} from "../shared/api";
import {productService} from "../services/ProductService";

export const useProductPagination = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [filters, setFilters] = useState<ProductServiceApiGetAllRequest>({
        brands: [],
        categories: [],
        subCategories: [],
        types: [],
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
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        console.log("Updated products in hook:", products);
    }, [products]);
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAll({ ...filters, page: filters.page! - 1 });
            setProducts([...data.content ?? []]);
            setTotalPages(data.totalPages ?? 0);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    }, [filters]);

    const fetchBrands = useCallback(async () => {
        try {
            const brandList = await productService.getBrands();
            setBrands(brandList ?? []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchProducts();
        })();
    }, [fetchProducts]);

    useEffect(() => {
        (async () => {
            await fetchBrands();
        })();
    }, [fetchBrands]);

    const updateFilters = (newFilters: Partial<ProductServiceApiGetAllRequest>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const nextPage = () => {
        if (filters.page && filters.page < totalPages) {
            setFilters((prev) => ({ ...prev, page: prev.page! + 1 }));
        }
    };

    const prevPage = () => {
        if (filters.page && filters.page > 1) {
            setFilters((prev) => ({ ...prev, page: prev.page! - 1 }));
        }
    };

    const setPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters((prev) => ({ ...prev, page }));
        }
    };

    return { products, brands, filters, updateFilters, nextPage, prevPage, setPage, loading, totalPages, fetchProducts};
};
