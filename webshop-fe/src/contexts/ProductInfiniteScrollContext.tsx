import React, {createContext, useCallback, useEffect, useRef, useState} from "react";
import {BrandResponse, ProductResponse, ProductServiceApiGetAllRequest} from "../shared/api";
import {productService} from "../services/ProductService";

interface ProductInfiniteScrollContextType {
    products: ProductResponse[];
    brands: BrandResponse[];
    loading: boolean;
    hasMore: boolean;
    fetchNextPage: () => void;
    totalElements: number;
    filters: ProductServiceApiGetAllRequest;
    updateFilters: (newFilters: Partial<ProductServiceApiGetAllRequest>) => void;
    priceRange: number[];
    discountRange: number[];
    urlFiltersApplied: boolean;
    setUrlFiltersApplied: (applied: boolean) => void;
}

export const ProductInfiniteScrollContext = createContext<ProductInfiniteScrollContextType | undefined>(undefined);

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

export const ProductInfiniteScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [filters, setFilters] = useState<ProductServiceApiGetAllRequest>(defaultFilters);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(1);
    const [page, setPage] = useState(1);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [discountRange, setDiscountRange] = useState<[number, number]>([0, 0]);
    const [urlFiltersApplied, setUrlFiltersApplied] = useState(false);

    const fetchedPagesRef = useRef<Set<number>>(new Set());

    const fetchNextPage = useCallback(async () => {
        if (loading || !hasMore) return;

        const currentPage = page - 1;
        if (fetchedPagesRef.current.has(currentPage)) return;
        fetchedPagesRef.current.add(currentPage);

        setLoading(true);
        try {
            const filtersToUse: ProductServiceApiGetAllRequest = {
                ...filters,
                page: page - 1,
                size: 10,
            };
            const data = await productService.getAll(filtersToUse);
            const content = data.content ?? [];

            if (content.length > 0) {
                setProducts((prev) => {
                    const newProducts = content.filter(
                        (p) => !prev.some((existing) => existing.id === p.id)
                    );
                    return [...prev, ...newProducts];
                });
                setTotalElements(data.totalElements ?? 0);
                setHasMore(content.length > 0);
                setPage((prev) => prev + 1);
                setPriceRange([data.minPrice ?? 0, data.maxPrice ?? 0]);
                setDiscountRange([data.minDiscount ?? 0, data.maxDiscount ?? 0]);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    }, [loading, hasMore, filters, page]);

    const fetchBrands = useCallback(async () => {
        try {
            const brandList = await productService.getBrands();
            setBrands(brandList ?? []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    }, []);

    useEffect(() => {
        if (!urlFiltersApplied) return;
        (async () => {
            await fetchNextPage();
        })();
    }, [urlFiltersApplied]);

    useEffect(() => {
        (async () => {
            await fetchBrands();
        })();
    }, [fetchBrands]);

    const updateFilters = (newFilters: Partial<ProductServiceApiGetAllRequest>) => {
        setFilters(prev => {
            const mergedFilters = {...prev, ...newFilters, page: 1};
            if (JSON.stringify(prev) === JSON.stringify(mergedFilters)) {
                return prev;
            }
            return mergedFilters;
        });
    };

    return (
        <ProductInfiniteScrollContext.Provider
            value={{
                products,
                brands,
                loading,
                hasMore,
                fetchNextPage,
                totalElements,
                filters,
                updateFilters,
                priceRange,
                discountRange,
                urlFiltersApplied,
                setUrlFiltersApplied,
            }}
        >
            {children}
        </ProductInfiniteScrollContext.Provider>
    );
};
