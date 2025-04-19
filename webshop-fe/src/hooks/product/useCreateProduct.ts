import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAdminGuard} from "../useAdminGuard";
import {ProductResponse, ProductServiceApiCreate1Request} from "../../shared/api";
import {ApiError} from "../../shared/ApiError";
import {productService} from "../../services/ProductService";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAdminGuard();

    return useMutation<ProductResponse, ApiError, ProductServiceApiCreate1Request>({
        mutationFn: async (data) => {
            assertAdmin();
            return productService.create(data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["products"]});
        },
    });
};
