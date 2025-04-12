import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "../../services/ProductService";
import {
    ProductPageProductResponse,
    ProductResponse,
    ProductServiceApiGetAllRequest,
} from "../../shared/api";
import { ApiError } from "../../shared/ApiError";

interface InfiniteProducts {
    pages: ProductPageProductResponse[];
    pageParams: unknown[];
    products: ProductResponse[];
    totalElements: number;
    priceRange: [number, number];
    discountRange: [number, number];
}

export const useProductScroll = (filters: ProductServiceApiGetAllRequest) => {
    const queryResult = useInfiniteQuery<
        ProductPageProductResponse,
        ApiError,
        InfiniteProducts,
        (string | ProductServiceApiGetAllRequest)[],
        number
    >({
        queryKey: ["infinite-products", filters],
        queryFn: async ({ pageParam = 0 }) => {
            return await productService.getAll({
                ...filters,
                page: pageParam,
                size: 10,
            });
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const currentLength = allPages.flatMap((p) => p.content ?? []).length;
            const total = lastPage.totalElements ?? 0;
            return currentLength < total ? allPages.length : undefined;
        },
        select: (data) => ({
            pages: data.pages,
            pageParams: data.pageParams,
            products: data.pages.flatMap((p) => p.content ?? []),
            totalElements: data.pages[0]?.totalElements ?? 0,
            priceRange: [
                data.pages[0]?.minPrice ?? 0,
                data.pages[0]?.maxPrice ?? 0,
            ],
            discountRange: [
                data.pages[0]?.minDiscount ?? 0,
                data.pages[0]?.maxDiscount ?? 0,
            ],
        }),
    });

    return {
        ...queryResult,
        products: queryResult.data?.products ?? [],
        totalElements: queryResult.data?.totalElements ?? 0,
        priceRange: queryResult.data?.priceRange ?? [0, 0],
        discountRange: queryResult.data?.discountRange ?? [0, 0],
    };
};
