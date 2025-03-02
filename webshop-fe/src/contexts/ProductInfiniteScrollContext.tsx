import React, { createContext, useState, useCallback, useEffect } from "react";
import {ProductResponse, ProductServiceApiGetAllRequest} from "../shared/api";
import {productService} from "../services/ProductService";

interface ProductInfiniteScrollContextType {
    products: ProductResponse[];
    loading: boolean;
    hasMore: boolean;
    fetchNextPage: () => void;
    resetProducts: () => void;
}

export const ProductInfiniteScrollContext = createContext<ProductInfiniteScrollContextType | undefined>(undefined);

export const ProductInfiniteScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchNextPage = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const filters: ProductServiceApiGetAllRequest = { page: page - 1, size: 10 };
            const data = await productService.getAll(filters);

            if (data.content) {
                setProducts((prev) => [...prev, ...data.content ?? []]);
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

    const resetProducts = () => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
    };

    useEffect(() => {
        (async () => {
            await fetchNextPage();
        })();
    }, []);

    return (
        <ProductInfiniteScrollContext.Provider value={{ products, loading, hasMore, fetchNextPage, resetProducts }}>
            {children}
        </ProductInfiniteScrollContext.Provider>
    );
};
