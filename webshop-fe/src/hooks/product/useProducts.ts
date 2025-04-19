import {useAdminGuard} from "../useAdminGuard";
import {useQuery} from "@tanstack/react-query";
import {productService} from "../../services/ProductService";
import {ProductPageProductResponse, ProductServiceApiGetAll1Request} from "../../shared/api";

export const useProducts = (filters: ProductServiceApiGetAll1Request) => {
    const {assertAdmin} = useAdminGuard();

    return useQuery<ProductPageProductResponse, Error, ProductPageProductResponse, [string, ProductServiceApiGetAll1Request]>({
        queryKey: ["products", filters],
        queryFn: async () => {
            assertAdmin();
            return await productService.getAll({
                ...filters,
                page: filters.page ? filters.page - 1 : 0,
            });
        },
        placeholderData: (prevData) => prevData,
    });
};
