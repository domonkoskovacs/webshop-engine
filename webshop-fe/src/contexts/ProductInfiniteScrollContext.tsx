import React, { createContext, useState, useCallback, useEffect } from "react";
import {BrandResponse, ProductResponse, ProductServiceApiGetAllRequest} from "../shared/api";
import {productService} from "../services/ProductService";

interface ProductInfiniteScrollContextType {
    products: ProductResponse[];
    brands: BrandResponse[];
    loading: boolean;
    hasMore: boolean;
    fetchNextPage: () => void;
    resetProducts: () => void;
    totalElements: number;
    updateFilters: (newFilters: Partial<ProductServiceApiGetAllRequest>) => void;
    resetFilters: () => void;
}

export const ProductInfiniteScrollContext = createContext<ProductInfiniteScrollContextType | undefined>(undefined);

export const ProductInfiniteScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(1);
    const [page, setPage] = useState(1);
    
    const fetchNextPage = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const filters: ProductServiceApiGetAllRequest = { page: page - 1, size: 10 };
            const data = await productService.getAll(filters);

            if (data.content) {
                setProducts((prev) => [...prev, ...data.content ?? []]);
                setTotalElements(data.totalElements ?? 0);
                setHasMore(data.content.length > 0);
                setPage((prev) => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    }, [page, hasMore, loading]);

    const fetchBrands = useCallback(async () => {
        try {
            const brandList = await productService.getBrands();
            setBrands(brandList ?? []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    }, []);

    const resetProducts = () => {
        setProducts([]);
        setPage(1);
        resetFilters();
        setHasMore(true);
    };

    useEffect(() => {
        (async () => {
            await fetchNextPage();
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await fetchBrands();
        })();
    }, [fetchBrands]);

    const updateFilters = (newFilters: Partial<ProductServiceApiGetAllRequest>) => {
        setFilters((prev) => ({...prev, ...newFilters, page: 1}));
    };

    const resetFilters = () => {
        setFilters({page: 1, size: 10});
    };

    return (
        <ProductInfiniteScrollContext.Provider value={{ products, brands, loading, hasMore, fetchNextPage, resetProducts, totalElements, updateFilters, resetFilters }}>
            {children}
        </ProductInfiniteScrollContext.Provider>
    );
};
