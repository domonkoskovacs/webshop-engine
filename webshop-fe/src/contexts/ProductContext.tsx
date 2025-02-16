import React, {createContext, useCallback, useEffect, useState} from 'react';
import {
    BrandResponse,
    ProductResponse,
    ProductServiceApiCreateRequest,
    ProductServiceApiGetAllRequest
} from "../shared/api";
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
    exportProducts: () => void;
    create: (productRequest: ProductServiceApiCreateRequest) => void;
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
            setDiscountRange([data.minDiscount ?? 0, data.maxDiscount ?? 0])
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

    const exportProducts = async () => {
        try {
            const response = await productService.export({
                from: undefined,
                to: undefined,
                brands: filters.brands,
                categories: filters.categories,
                subCategories: filters.subCategories,
                types: filters.types,
                maxPrice: filters.maxPrice,
                minPrice: filters.minPrice,
                maxDiscountPercentage: filters.maxDiscountPercentage,
                minDiscountPercentage: filters.minDiscountPercentage,
                itemNumber: filters.itemNumber,
                showOutOfStock: filters.showOutOfStock,
            });
            if (response.csv) {
                const csvData = atob(response.csv);
                const blob = new Blob([csvData], {type: "text/csv"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "products.csv";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't export products. Please try again.",
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

    const create = async (productRequest: ProductServiceApiCreateRequest) => {
        try {
            const response = await productService.create(productRequest)
            setProducts((prevProducts) => [...prevProducts, response]);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't create product. Please try again.",
            });
            throw error
        }
    }

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
            discountRange,
            exportProducts,
            create
        }}>
            {children}
        </ProductContext.Provider>
    );
};
