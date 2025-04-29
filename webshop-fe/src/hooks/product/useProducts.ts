import {useAuthGuard} from "../useAuthGuard";
import {useQuery} from "@tanstack/react-query";
import {productService} from "@/services/ProductService.ts";
import {ProductPageProductResponse, ProductServiceApiGetAll1Request} from "@/shared/api";

export const useProducts = (filters: ProductServiceApiGetAll1Request) => {
    const {isAdmin} = useAuthGuard();

    return useQuery<ProductPageProductResponse, Error, ProductPageProductResponse, [string, ProductServiceApiGetAll1Request]>({
        queryKey: ["products", filters],
        queryFn: async () => {
            return await productService.getAll({
                ...filters,
                page: filters.page ? filters.page - 1 : 0,
            });
        },
        enabled: isAdmin,
        placeholderData: (prevData) => prevData,
    });
};
