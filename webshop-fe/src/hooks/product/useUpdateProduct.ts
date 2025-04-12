import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAdminGuard} from "../useAdminGuard";
import {ProductResponse, ProductServiceApiUpdateRequest} from "../../shared/api";
import {ApiError} from "../../shared/ApiError";
import {productService} from "../../services/ProductService";

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAdminGuard();

    return useMutation<ProductResponse, ApiError, ProductServiceApiUpdateRequest>({
        mutationFn: async (data) => {
            assertAdmin();
            return productService.update(data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["products"]});
        },
    });
};
