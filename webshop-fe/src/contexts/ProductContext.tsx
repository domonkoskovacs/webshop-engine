import React, {createContext, useCallback, useEffect, useState} from 'react';
import {
    BrandResponse,
    Discount,
    ProductResponse,
    ProductServiceApiCreateRequest,
    ProductServiceApiGetAllRequest,
    ProductServiceApiUpdateRequest
} from "../shared/api";
import {productService} from "../services/ProductService";
import {toast} from "../hooks/UseToast";
import {downloadCSV} from "../lib/file.utils";

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
    deleteProducts: (id: string[]) => void;
    priceRange: number[];
    discountRange: number[];
    exportProducts: () => void;
    create: (productRequest: ProductServiceApiCreateRequest) => void;
    update: (productRequest: ProductServiceApiUpdateRequest) => void;
    getById: (id: string) => Promise<ProductResponse>;
    setDiscounts: (discounts: Discount[]) => void;
    importProducts: (csv: string) => void;
    getProductsByCategory: (category: string) => Promise<ProductResponse[]>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [brands, setBrands] = useState<BrandResponse[]>([]);
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

    const deleteProducts = async (ids: string[]) => {
        try {
            await productService.delete(ids);
            setProducts((prevProducts) =>
                prevProducts.filter(product => !ids.includes(product.id ?? ''))
            );
            toast({
                description: "Product(s) successfully deleted!",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't delete product(s). Please try again.",
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
                genders: filters.genders,
                maxPrice: filters.maxPrice,
                minPrice: filters.minPrice,
                maxDiscountPercentage: filters.maxDiscountPercentage,
                minDiscountPercentage: filters.minDiscountPercentage,
                itemNumber: filters.itemNumber,
                showOutOfStock: filters.showOutOfStock,
            });
            if (response.csv) {
                downloadCSV(response.csv, "products.csv");
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

    const update = async (productRequest: ProductServiceApiUpdateRequest) => {
        try {
            const response = await productService.update(productRequest)
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === response.id ? response : product
                )
            );
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't update product. Please try again.",
            });
            throw error
        }
    }

    const getById = async (id: string) => {
        try {
            return await productService.getById(id)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't get product. Please try again.",
            });
            throw error
        }
    }

    const setDiscounts = async (discounts: Discount[]) => {
        try {
            await productService.setDiscounts(discounts);
            setProducts((prevProducts) =>
                prevProducts.map(product => {
                    const discount = discounts.find(d => d.id === product.id);
                    return discount
                        ? {...product, discountPercentage: discount.discount}
                        : product;
                })
            );
            toast({
                description: "Discount(s) updated successfully!",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't update discount(s). Please try again.",
            });
        }
    }

    const importProducts = async (csv: string) => {
        try {
            const response = await productService.import(csv);
            await fetchProducts();
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    const getProductsByCategory = async (category: string): Promise<ProductResponse[]> => {
        try {
            const requestParams: ProductServiceApiGetAllRequest = {
                categories: [category],
                page: 0,
                size: 4,
                showOutOfStock: false,
                sortType: "DESC_PRICE"
            };
            const products = await productService.getAll(requestParams);
            return products.content ?? [];
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't get products. Please try again.",
            });
            return []
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
            deleteProducts,
            priceRange,
            discountRange,
            exportProducts,
            create,
            update,
            getById,
            setDiscounts,
            importProducts,
            getProductsByCategory
        }}>
            {children}
        </ProductContext.Provider>
    );
};
