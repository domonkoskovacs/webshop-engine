import {useAdminGuard} from "../useAdminGuard";
import {useQuery} from "@tanstack/react-query";
import {productService} from "../../services/ProductService";
import {ProductPageProductResponse, ProductServiceApiGetAllRequest} from "../../shared/api";

export const useProducts = (filters: ProductServiceApiGetAllRequest) => {
    const {assertAdmin} = useAdminGuard();

    return useQuery<ProductPageProductResponse, Error, ProductPageProductResponse, [string, ProductServiceApiGetAllRequest]>({
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
