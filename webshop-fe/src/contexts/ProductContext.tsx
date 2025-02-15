import React, {createContext, useCallback, useEffect, useState} from 'react';
import {BrandResponse, ProductResponse, ProductServiceApiGetAllRequest} from "../shared/api";
import {productService} from "../services/ProductService";
import {toast} from "../hooks/UseToast";

interface ProductContextType {
    products: ProductResponse[];
    brands: BrandResponse[];
    filters: ProductServiceApiGetAllRequest;
    updateFilters: (newFilters: Partial<ProductServiceApiGetAllRequest>) => void;
    resetFilters: () => void;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number) => void;
    loading: boolean;
    totalPages: number;
    totalElements: number;
    fetchProducts: () => void;
    deleteProduct: (id: string) => void;
    priceRange: number[];
    discountRange: number[];
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
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
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [discountRange, setDiscountRange] = useState<[number, number]>([0, 0]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(1);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAll({...filters, page: filters.page! - 1});
            setProducts([...data.content ?? []]);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
            setPriceRange([data.minPrice ?? 0, data.maxPrice ?? 0])
            console.log(priceRange)
            setDiscountRange([data.minDiscount ?? 0, data.maxDiscount ?? 0])
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    }, [filters, priceRange]);

    const fetchBrands = useCallback(async () => {
        try {
            const brandList = await productService.getBrands();
            setBrands(brandList ?? []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    }, []);

    const deleteProduct = async (id: string) => {
        try {
            await productService.delete(id);
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
            toast({
                description: "Product successfully deleted!",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't delete product. Please try again.",
            });
        }
    }

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
        setFilters((prev) => ({...prev, ...newFilters, page: 1}));
    };

    const resetFilters = () => {
        setFilters({page: 1, size: 10});
    };

    const nextPage = () => {
        if (filters.page && filters.page < totalPages) {
            setFilters((prev) => ({...prev, page: prev.page! + 1}));
        }
    };

    const prevPage = () => {
        if (filters.page && filters.page > 1) {
            setFilters((prev) => ({...prev, page: prev.page! - 1}));
        }
    };

    const setPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters((prev) => ({...prev, page}));
        }
    };

    return (
        <ProductContext.Provider value={{
            products,
            brands,
            filters,
            updateFilters,
            resetFilters,
            nextPage,
            prevPage,
            setPage,
            loading,
            totalPages,
            totalElements,
            fetchProducts,
            deleteProduct,
            priceRange,
            discountRange
        }}>
            {children}
        </ProductContext.Provider>
    );
};
